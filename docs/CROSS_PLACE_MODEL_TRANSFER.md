# Cross-place model transfer through Roblox packages

## Status

**Current, unvalidated:** the gateway tools and plugin handlers below are
implemented, but the
[required Roblox validation](#required-roblox-validation) has not been run. Until a
real two-place prototype passes it, treat every Roblox-side behavior described
here as an assumption the code makes, not a fact. [Implementation](#implementation)
records where the code departs from or narrows the design.

This document is the handoff for implementing model transfer between declared
Roblox places through Sandblock Code's project-bound MCP gateway and Studio
plugin. It records the chosen design, its reasons, and the questions that must
be verified against Roblox before the feature is considered complete.

## Goal

Let an agent transfer an arbitrary Studio model from one declared place to
another without asking a human to export and import an `.rbxm` file.

The transfer must preserve the existing Sandblock ownership rules:

- Sandblock Code resolves projects, runtimes, repository paths, and place keys.
- The agent addresses places through the project's declared allowlist.
- The Studio plugin checks `game.PlaceId` before reading or mutating Studio.
- Rojo remains responsible for filesystem-owned trees. A transferred model
  must not be inserted where the active Rojo project will overwrite it.

## Chosen design

Use one Roblox **transfer package** per project or universe as a versioned
shuttle. A transfer publishes a new version of that existing asset instead of
creating a new asset for every model.

Each published version contains one envelope:

```text
SandblockTransferPackage
└── Payload
    └── <transferred model>
```

The versions are snapshots, not an accumulating library of subfolders. The next
transfer replaces `Payload` and publishes another version of the same package.
This keeps one stable `packageId`, although every transfer still performs an
upload and adds a version to the package history.

The gateway serializes publication per transfer package. The destination must
load the exact version returned for its transfer, never "latest": another agent
may publish a newer payload before the destination finishes.

After insertion, the plugin extracts `Payload` and detaches it from the shuttle.
The transferred model is an independent copy and does not retain the transfer
package's `PackageLink` or receive its later versions.

## Agent-facing MCP interface

The convenience tool is:

```ts
transfer_model_between_places({
  fromPlace: "main",
  modelPath: "Workspace.Map.House",
  toPlace: "lobby",
  destinationPath: "Workspace.Map",
  packageMode: "transfer",
  idempotencyKey: "agent-generated-stable-key"
})
```

`packageMode` has two explicit values:

- `"transfer"` reuses the project's transfer package, publishes one version,
  loads that exact version in the destination, extracts the payload, and leaves
  an independent model.
- `"dedicated"` creates a new permanent Roblox package for the model, preserves
  its package identity, and returns its `packageId` for later insertion or
  version publication.

Do not replace this enum with an ambiguous boolean such as `createPackage`.

A successful transfer result must expose what happened:

```json
{
  "success": true,
  "packageMode": "transfer",
  "packageId": 123456789,
  "packageVersion": 42,
  "assetVersionId": 987654321,
  "insertedPath": "Workspace.Map.House",
  "remainsLinkedToPackage": false
}
```

The exact identifiers returned by Roblox still require a prototype; see
[Required Roblox validation](#required-roblox-validation).

Keep the lower-level package tools available because they express different
Roblox operations:

```text
create_package
publish_package_version
insert_package
update_package_copy_to_latest
transfer_model_between_places
```

Their meanings are:

| Tool | Effect |
| --- | --- |
| `create_package` | Create a new permanent package and a new Roblox asset ID. |
| `publish_package_version` | Publish a new version of an existing package; this makes the version available but does not force every copy to update immediately. |
| `insert_package` | Add a package copy to one declared place. |
| `update_package_copy_to_latest` | Update one named package copy to the latest published version. |
| `transfer_model_between_places` | Orchestrate a one-off copy through the transfer package or create a dedicated package when explicitly requested. |

Do not add `update_package_everywhere` in the first implementation. Roblox mass
updates can save multiple places, skip locally modified copies, and conflict
with other open Studio sessions. That operation needs a separate design and an
explicit human approval policy.

## Transfer sequence

For `packageMode: "transfer"`:

1. Resolve `fromPlace` and `toPlace` from the active project's declared places.
2. Require the source and destination Studio connections to claim those exact
   place IDs.
3. Reject a destination controlled by the active Rojo tree.
4. Resolve `modelPath` in the source Studio and validate the payload before any
   upload.
5. Acquire the project transfer package's publication lock.
6. Replace the shuttle's `Payload` and publish a new model/package version with
   `AssetService:CreateAssetVersionAsync` from the locally loaded plugin.
7. Record the exact version reference associated with the successful upload.
8. Command the destination Studio to load that exact version, extract
   `Payload`, parent it under `destinationPath`, and remove the transfer wrapper
   and package linkage.
9. Verify the inserted instance path and return the result.
10. Release the publication lock and record duration, attempts, owner, package,
    and version in tool history.

If the source and destination are the same place, use an ordinary Studio clone
instead of publishing a transfer version.

## Ownership and permissions

Prefer a transfer package owned by the creator that owns the experience:

1. use the owning group for a group-owned experience;
2. use the owning user for a user-owned experience;
3. otherwise require an explicit asset permission grant or refuse the transfer.

Creating the package under the logged-in developer is not automatically enough
for a group-owned place to load it. The implementation must validate ownership
or effective permission before publication and again before destination load.

A dedicated package follows the same rule. Roblox does not support transferring
asset ownership later, so selecting the creator is a durable decision.

## Rate limits and failure behavior

Roblox documents `AssetService:CreateAssetVersionAsync` as having a low HTTP
request limit but does not publish a contractual numeric limit. A community
report mentions 30 `CreateAssetAsync` requests per minute; treat that only as an
observation, not as the limit for package-version publication.

Start conservatively per asset owner:

- one in-flight publication per transfer package;
- a three-second minimum interval, at most 20 publications per minute;
- bounded exponential retry delays of 2, 4, 8, and 16 seconds;
- an idempotency key so a retry after an uncertain response cannot create a
  second logical transfer;
- a final explicit failure rather than an unbounded retry loop.

The internal limit is a protective default, not a claim about Roblox. Instrument
successful calls, failures, durations, and throttling so it can be adjusted from
observed behavior.

Open Cloud limits can be shared across keys owned by the same user or group,
can include undocumented stability limits, and may return HTTP 429. When a
response exposes `Retry-After` or rate-limit headers, honor them. A model upload
is limited to 20 MB by the documented Assets API. The Studio method can still
fail for permissions, unsupported content, moderation, service availability, or
Roblox throttling; communicate these as structured tool errors.

Example error:

```json
{
  "success": false,
  "code": "package_publish_throttled",
  "retryable": true,
  "attempts": 4,
  "message": "Roblox refused the transfer package version after bounded retries."
}
```

An agent skill must say that transfers can fail and that the gateway owns
retries. An agent must not manually repeat an uncertain call with a new
idempotency key.

## Required Roblox validation

Complete a real two-place prototype before treating the design as implemented:

1. Confirm that the installed Sandblock plugin qualifies for
   `AssetService:CreateAssetVersionAsync`, which Roblox documents for locally
   loaded plugins.
2. Determine the exact relationship among the value returned by
   `CreateAssetVersionAsync`, Open Cloud's `versionNumber` or `revisionId`, and
   the `assetVersionId` required by `InsertService:LoadAssetVersion`.
3. Prove that the destination can load an exact historical transfer version,
   not only the latest package version.
4. Verify that extracting `Payload` and removing the wrapper produces an
   independent model with no active transfer-package linkage.
5. Exercise user-owned, group-owned, explicitly shared, and refused ownership
   cases.
6. Measure throttling with bounded tests and record the actual error shape
   returned to Luau.
7. Test representative models containing scripts, attributes, tags, internal
   references, meshes, nested packages, and restricted assets.
8. Verify behavior near the accepted size limit and ensure a refused transfer
   leaves both places unchanged.

If exact historical version loading cannot be made reliable, stop and redesign
the shuttle before implementation. Loading "latest" is not an acceptable
fallback because concurrent transfers can deliver the wrong model.

## Skill guidance

The eventual Roblox agent skill should contain this decision rule:

> For a one-off model copy between declared places, call
> `transfer_model_between_places` with `packageMode: "transfer"`. Sandblock
> reuses the project's transfer package, publishes one exact version, inserts
> that payload in the destination, and detaches the result.
>
> Use `packageMode: "dedicated"` when the model needs a permanent Roblox package
> identity, retained `PackageLink`, insertion into multiple places, or future
> package-version updates. Use the lower-level package tools when the task names
> those lifecycle operations directly.
>
> Package publication can fail because of ownership, permissions, size,
> unsupported content, moderation, service availability, or throttling. Report
> the structured failure. The gateway owns serialization, idempotence, and
> retries; do not repeat an uncertain transfer manually.

## Implementation ownership

- `sandblock-code` owns the MCP interface, place routing, transfer-package
  registry, creator resolution, idempotency, publication queue, retry policy,
  tool history, and structured results.
- `sandblock-studio-plugin` owns source instance resolution, payload validation,
  calls to Roblox asset methods, exact-version loading, destination insertion,
  detachment, and Studio-side verification.
- `sandblock-rojo` requires no transfer-specific behavior. Its responsibility is
  unchanged; the implementation must detect and protect Rojo-owned destinations.
- Root documentation owns the cross-repository contract. Update
  `ARCHITECTURE.md` and `DECISIONS.md` when the prototype resolves the open
  Roblox questions and the design becomes an accepted implementation contract.

## Implementation

**Current, unvalidated.** The gateway side is `sandblock-code/src/packages.ts`
(registry, publication queue, idempotency, orchestration) and
`sandblock-code/src/tools/packages.ts` (the five MCP tools). The Studio side is
`sandblock-studio-plugin/src/Handlers/Packages.lua`.

The gateway sequences these plugin commands. Each one carries `expectedPlaceId`,
and the plugin refuses a Studio holding another place:

| Command | Step |
| --- | --- |
| `package_inspect_destination` | Resolve `destinationPath`, report the owner and universe, run the Rojo check. |
| `package_inspect_source` | Resolve `modelPath` and report the owner, universe, and model. |
| `package_publish` | Publish the shuttle version (`transfer`), a new package (`dedicated`), or a named package's next version (`version`). |
| `package_insert` | Load an asset version, verify it, insert it, and detach the shuttle copy. |
| `package_clone_local` | Clone within one place, used when source and destination are the same place. |
| `package_update_copy` | Replace one package copy with the latest version, keeping its parent, name, and pivot. |

Each command answers `{ ok: true, ... }` or `{ ok: false, code, message,
retryable }`. The tools return refusals as structured results such as the
example above.

Choices the design left open, or that the code narrows:

- **The shuttle is a versioned Model asset.** `transfer` mode publishes it with
  `AssetService:CreateAssetAsync` and `IsPackage = false`, then publishes later
  versions with `CreateAssetVersionAsync`. Nothing links the shuttle to a
  `PackageLink`, so detaching only has to remove a link that points at the
  shuttle. Validation must confirm that a plain Model asset accepts versions. If
  it does not, publish the shuttle as a package instead.
- **One shuttle per universe.** The gateway stores
  `{ universeId → assetId, creator }` in `transfer-packages.json`. The desktop
  app puts that file in its user data directory through
  `SANDBLOCK_TRANSFER_PACKAGES_FILE`; without the variable it goes in
  `~/.sandblock-code/`. A shuttle whose recorded owner differs from the place's
  current owner is refused rather than replaced.
- **Exact version.** Right after publishing, while the gateway still holds the
  owner's publication lock, the plugin polls
  `InsertService:GetLatestAssetVersionAsync` until it returns a new
  `assetVersionId`, for up to ten seconds. The destination then loads that id
  with `InsertService:LoadAssetVersion`. If no new id appears, the transfer fails
  with `package_version_unresolved` and nothing is inserted.
- **Version verification.** Each shuttle version carries a fresh
  `SandblockTransferId` attribute on its envelope. The destination refuses with
  `transfer_version_mismatch` if the version it loaded carries another id. Even if
  the version lookup is wrong, the result is a refusal, never the wrong model.
- **Ownership.** Only places with the same owner (`game.CreatorType` and
  `game.CreatorId`) can transfer to each other. Different owners are refused with
  `creator_mismatch`. Explicitly shared assets are not supported yet.
- **Rojo check.** The plugin keeps the instance map from the live Rojo session.
  It finds the nearest instance at or above the destination that Rojo syncs and
  reads that instance's metadata from the Rojo server (`/api/read/<id>`). The
  destination is refused (`rojo_owned_destination`) unless
  `ignoreUnknownInstances` is true there. If the place declares a Rojo project
  but Rojo is not connected in that Studio, the transfer is refused with
  `rojo_not_connected`.
- **Size.** Before uploading, the plugin serializes the payload with
  `SerializationService` and refuses anything over 20 MB. A Studio without that
  service skips the check, and Roblox's own refusal applies.
- **Queue.** Publications are serialized per owner, at least three seconds apart
  and at most 20 per rolling minute. Throttling, timeouts, server errors, and
  bridge timeouts are retried after 2, 4, 8, and 16 seconds. Permission and
  moderation refusals are not retried.
- **Idempotency.** Results are kept in gateway memory for one hour per key. A key
  reused with different arguments is refused with `idempotency_key_reused`.
- **`update_package_copy_to_latest`.** It loads the latest version with
  `InsertService:LoadAsset` and replaces the copy. The old copy is unparented, not
  destroyed, so Studio's undo restores it. Local edits to that copy are lost.

## Primary Roblox references

- [AssetService](https://create.roblox.com/docs/reference/engine/classes/AssetService)
- [InsertService](https://create.roblox.com/docs/reference/engine/classes/InsertService/Insert)
- [Packages](https://create.roblox.com/docs/projects/assets/packages)
- [Assets API usage](https://create.roblox.com/docs/cloud/guides/usage-assets)
- [Open Cloud rate limits](https://create.roblox.com/docs/cloud/reference/rate-limits)

