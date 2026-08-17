import * as Y from 'yjs';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'https://docs.hiddogames.com';
const WS = '6c987837-d07d-4c6b-9841-c6702922b08a';
const ROOT = process.argv[2] || 'VzAoc7HPyUIkg3nelFyDZ';
const OUT = process.argv[3] || 'out';

fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'raw'), { recursive: true });

const linkedDocs = new Set();
const blobs = new Set();

// Blob keys are base64 hashes with no extension; assign stable short names and
// fix up the extension after we've seen the content type.
const assetNames = new Map();
function assetName(key) {
  if (!assetNames.has(key)) {
    assetNames.set(key, `asset-${String(assetNames.size + 1).padStart(2, '0')}`);
  }
  return assetNames.get(key);
}

async function fetchDoc(docId) {
  const res = await fetch(`${BASE}/api/workspaces/${WS}/docs/${docId}`);
  if (!res.ok) return null;
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('octet-stream')) return null;
  const buf = new Uint8Array(await res.arrayBuffer());
  fs.writeFileSync(path.join(OUT, 'raw', `${docId}.ydoc`), buf);
  return buf;
}

function escapeMd(s) {
  return s.replace(/([\\`*_{}\[\]#+])/g, '\\$1');
}

// Render a Y.Text (BlockSuite rich text) delta into markdown
function renderText(yText) {
  if (!yText) return '';
  let delta;
  try {
    delta = yText.toDelta ? yText.toDelta() : null;
  } catch {
    return String(yText);
  }
  if (!delta) return typeof yText === 'string' ? yText : '';
  let out = '';
  for (const op of delta) {
    let t = op.insert;
    const a = op.attributes || {};
    if (typeof t !== 'string') {
      // embedded object, e.g. reference
      if (a.reference?.pageId) {
        linkedDocs.add(a.reference.pageId);
        out += `[[doc:${a.reference.pageId}]]`;
      }
      continue;
    }
    if (a.reference?.pageId) {
      linkedDocs.add(a.reference.pageId);
      out += `[${t || 'linked doc'}](./${a.reference.pageId}.md)`;
      continue;
    }
    t = escapeMd(t);
    if (a.code) t = `\`${op.insert}\``;
    if (a.bold) t = `**${t}**`;
    if (a.italic) t = `*${t}*`;
    if (a.strike) t = `~~${t}~~`;
    if (a.underline) t = `<u>${t}</u>`;
    if (a.link) t = `[${t}](${a.link})`;
    out += t;
  }
  return out;
}

const HEADINGS = { h1: '#', h2: '##', h3: '###', h4: '####', h5: '#####', h6: '######' };

function renderBlock(block, blocksMap, depth, lines, listCounter) {
  const flavour = block.get('sys:flavour');
  const text = renderText(block.get('prop:text'));
  const indent = '  '.repeat(Math.max(0, depth));

  switch (flavour) {
    case 'affine:page':
      lines.push(`# ${block.get('prop:title')?.toString() ?? ''}`, '');
      break;
    case 'affine:paragraph': {
      const type = block.get('prop:type');
      if (HEADINGS[type]) lines.push(`${HEADINGS[type]} ${text}`, '');
      else if (type === 'quote') lines.push(`> ${text}`, '');
      else lines.push(text, '');
      break;
    }
    case 'affine:list': {
      const type = block.get('prop:type');
      let marker = '-';
      if (type === 'numbered') {
        const n = (listCounter.get(depth) || 0) + 1;
        listCounter.set(depth, n);
        marker = `${n}.`;
      } else if (type === 'todo') {
        marker = block.get('prop:checked') ? '- [x]' : '- [ ]';
      }
      lines.push(`${indent}${marker} ${text}`);
      break;
    }
    case 'affine:code': {
      const lang = block.get('prop:language') || '';
      lines.push('```' + (lang === 'Plain Text' ? '' : lang), block.get('prop:text')?.toString() ?? '', '```', '');
      break;
    }
    case 'affine:divider':
      lines.push('---', '');
      break;
    case 'affine:image': {
      const sourceId = block.get('prop:sourceId');
      const caption = block.get('prop:caption') || '';
      if (sourceId) {
        blobs.add(sourceId);
        lines.push('', `![${caption}](./assets/${assetName(sourceId)})`, '');
      }
      break;
    }
    case 'affine:attachment': {
      const sourceId = block.get('prop:sourceId');
      const name = block.get('prop:name') || sourceId;
      if (sourceId) {
        blobs.add(sourceId);
        lines.push('', `[attachment: ${name}](./assets/${assetName(sourceId)})`, '');
      }
      break;
    }
    case 'affine:bookmark':
    case 'affine:embed-link':
      lines.push(`[${block.get('prop:title') || block.get('prop:url')}](${block.get('prop:url')})`, '');
      break;
    case 'affine:embed-linked-doc':
    case 'affine:embed-synced-doc': {
      const pid = block.get('prop:pageId');
      if (pid) {
        linkedDocs.add(pid);
        lines.push(`[linked doc](./${pid}.md)`, '');
      }
      break;
    }
    case 'affine:database': {
      lines.push(`**[database: ${block.get('prop:title')?.toString() ?? ''}]**`, '');
      break;
    }
    case 'affine:surface':
    case 'affine:note':
    case 'affine:frame':
      break;
    default:
      if (text) lines.push(`${indent}${text}`, '');
      else lines.push(`<!-- unhandled block: ${flavour} -->`);
  }

  const children = block.get('sys:children');
  const childIds = children?.toArray ? children.toArray() : (children || []);
  const isList = flavour === 'affine:list';
  const childDepth = isList ? depth + 1 : depth;
  const childCounter = isList ? new Map() : listCounter;
  for (const cid of childIds) {
    const child = blocksMap.get(cid);
    if (child) renderBlock(child, blocksMap, childDepth, lines, childCounter);
  }
  if (isList && depth === 0) {
    // separate top-level lists from following content
  }
}

function docToMarkdown(buf) {
  const doc = new Y.Doc();
  Y.applyUpdate(doc, buf);
  const blocksMap = doc.getMap('blocks');
  // find root (affine:page)
  let root = null;
  for (const [, b] of blocksMap) {
    if (b.get && b.get('sys:flavour') === 'affine:page') { root = b; break; }
  }
  if (!root) return { title: null, md: '' };
  const title = root.get('prop:title')?.toString() ?? 'Untitled';
  const lines = [];
  renderBlock(root, blocksMap, 0, lines, new Map());
  // collapse >2 blank lines
  let md = lines.join('\n').replace(/\n{3,}/g, '\n\n');
  // ensure a blank line where a list ends and other content begins
  md = md.replace(/^((?:\s*(?:[-*]|\d+\.) .*))\n(?=\S)(?!(?:[-*]|\d+\.) )/gm, '$1\n\n');
  return { title, md };
}

const seen = new Set();
const manifest = [];
const queue = [ROOT];

while (queue.length) {
  const docId = queue.shift();
  if (seen.has(docId)) continue;
  seen.add(docId);
  const buf = await fetchDoc(docId);
  if (!buf) {
    console.log(`SKIP (not public): ${docId}`);
    manifest.push({ docId, status: 'not-public' });
    continue;
  }
  const before = new Set(linkedDocs);
  const { title, md } = docToMarkdown(buf);
  fs.writeFileSync(path.join(OUT, `${docId}.md`), `---\ntitle: ${JSON.stringify(title)}\nsource: ${BASE}/workspace/${WS}/${docId}\n---\n\n${md}\n`);
  console.log(`OK  ${docId}  "${title}"  (${md.length} chars)`);
  manifest.push({ docId, title, status: 'ok', chars: md.length });
  for (const l of linkedDocs) if (!before.has(l) || !seen.has(l)) queue.push(l);
}

// download blobs, naming them with the extension the server reports
const EXT = { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/gif': '.gif', 'image/webp': '.webp', 'image/svg+xml': '.svg', 'application/pdf': '.pdf' };
const blobInfo = [];
const renames = new Map();
for (const key of blobs) {
  const res = await fetch(`${BASE}/api/workspaces/${WS}/blobs/${encodeURIComponent(key)}`);
  if (!res.ok) { console.log(`BLOB FAIL ${key} ${res.status}`); continue; }
  const b = Buffer.from(await res.arrayBuffer());
  const type = res.headers.get('content-type') || '';
  const name = assetName(key) + (EXT[type.split(';')[0]] || '.bin');
  fs.writeFileSync(path.join(OUT, 'assets', name), b);
  renames.set(assetName(key), name);
  blobInfo.push({ key, file: `assets/${name}`, bytes: b.length, type });
  console.log(`BLOB ${name} ${b.length} bytes ${type}`);
}

// patch extension-less asset references in the generated markdown
for (const entry of manifest) {
  if (entry.status !== 'ok') continue;
  const p = path.join(OUT, `${entry.docId}.md`);
  let md = fs.readFileSync(p, 'utf8');
  for (const [stub, name] of renames) md = md.replaceAll(`./assets/${stub})`, `./assets/${name})`);
  fs.writeFileSync(p, md);
}

fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify({ workspace: WS, root: ROOT, docs: manifest, blobs: blobInfo }, null, 2));
console.log(`\nDocs: ${manifest.length}, blobs: ${blobs.size}`);
