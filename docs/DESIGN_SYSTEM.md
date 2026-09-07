# Shared design direction

Sandblock Code and the Studio plugin should feel like one product while using
the native UI technology of each environment.

## Product character

The visual direction is focused, technical, premium, and calm. Interfaces favor
clear runtime state and quick recovery over dense dashboards. The established
base is a dark translucent surface, warm Sandblock yellow, restrained neutral
text, thin low-opacity borders, and official icons where available.

The current anchor accent is `#f6c944`. Treat it as a semantic primary/accent
token, not as a reason to make every element yellow.

## Shared semantic tokens

Both implementations should map the same concepts:

- canvas, elevated surface, and translucent surface;
- primary and secondary text;
- subtle border and stronger focus border;
- Sandblock accent and accent-on-color text;
- success, warning, error, and disconnected states;
- compact, regular, and spacious gaps;
- small, medium, and large corner radii.

Exact rendering values can differ where platform constraints require it. Keep a
small generated or hand-maintained token mapping rather than trying to share a
React component library with Roblox Studio.

## Reusable package

**Current:** the independent `sandblock-ui` repository owns the publishable
`@sandblock/ui` package. Its canonical `tokens.json` generates CSS variables
and a typed TypeScript export. It also owns product-agnostic web primitives such as
buttons, choice cards, search fields, status badges, empty states, surfaces,
the shared icon set, and a byte-identical copy of the official Sandblock Code
application icon for web consumers. Sandblock Code consumes these exports directly, so
package changes are exercised by the owning product rather than maintained as
an unused copy.

Other React or Electron projects may consume the components. Non-web renderers
consume the semantic token data and maintain a native mapping. Product state,
navigation, Electron APIs, MCP behavior, and project-specific components do not
belong in the shared package. In particular, the Roblox Studio plugin remains
Luau-native and must not import or emulate a React component runtime.

## Desktop app

The Electron/React app can use CSS, platform vibrancy, native macOS traffic
lights, responsive layout, and accessible web controls. A repository selector
defines the current workspace; Project, Skills, Assets, Studio, and Settings
are its primary navigation. Runtime state should be visible without turning
the screen into a monitoring dashboard.

## Roblox Studio plugin

The plugin uses Luau `GuiObject` instances and Studio dock widgets, not React or
CSS. Match Sandblock through tokens, typography hierarchy, iconography, spacing,
and state language. Respect Studio theme/readability constraints and keep the
panel useful at narrow dock widths.

The default view should answer:

- Which Sandblock project is selected?
- Does its configured place match this Studio session?
- Are MCP and Rojo connected?
- What failed, and what can the developer retry?

## Interaction rules

- Reserve the official-site-inspired tactile button treatment for prominent
  launch, conversion, or onboarding actions. Dense application controls remain
  flat and compact.
- Use full-surface choice cards for short option sets where the entire label,
  icon, and description should be one selection target. Keep the selected state
  explicit with both contrast and an icon.
- Auto-open the plugin only for a valid intentional launch from Sandblock Code.
- Always retain a normal toolbar/menu way to reopen it.
- Prefer direct recovery actions beside actionable errors.
- Use color plus text/icon, never color alone, for health state.
- Keep advanced diagnostics available but secondary.
- Do not revive historical task-board navigation in the v0 desktop UI.

Before declaring UI work complete, inspect the actual rendered desktop or
Studio surface at the sizes developers will use.
