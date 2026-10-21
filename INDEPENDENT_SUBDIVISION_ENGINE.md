# Independent per-variation beat divisions — development branch

Branch: `feature/per-variation-subdivision-engine`  
Status: **development candidate; NOT published to main or gh-pages**.

## Shared architecture

- `variation-engine.js`: pure music/time-domain engine (no DOM, no sound dependencies).
- `engine/groove-core.js`: shared UI, editor, audio scheduler, VexFlow score renderer and sound-kit wiring.
- `index.html`: Groove Lab shell loading both engine modules.
- `one-drop.html`: One Drop shell loading those **same** engine modules.
- `machines/one-drop.js`: unchanged One Drop musical preset data from `feature/shared-engine-one-drop`; no H5/H6 musical revisions.
- `variation-engine-demo.html`: independent 3-lane synthetic scheduling and grid editor example.
- `variation-engine.test.js`, `engine/engine-smoke.test.js`: regressions for clock, migration, storage, MIDI-style event scheduling, dynamic grid, notation and machine separation.

## New variation contract

```js
{
  id: "HH6",
  name: "A descriptive label",
  instrument: "HH",
  bars: [{
    divisions: [4, 6, 4, 6],
    notes: [
      {tick: 0, velocity: "normal", articulation: "closed"},
      {tick: 2, velocity: "accent", articulation: "open"}
    ]
  }]
}
```

Each quarter note has **12 internal ticks**; a 4/4 bar is 48 ticks. Allowed divisions are 2, 3, 4 or 6 per beat. A note's `tick` is absolute within its own bar. The sequencer, scheduler, swing, notation and click derive from the variation objects, not a shared grid. If any selected instrument plays two bars, all selected instruments share the two-bar cycle and one-bar variations repeat their first bar.

Swing applies only to duple subdivisions (2 and 4 per beat); 3 and 6 retain their recorded triplet proportions. There is no per-instrument tempo or clock drift.

## Saved data and compatibility

Each machine has a different prefix (`groove-lab` or `one-drop-v1`). The independent engine uses:

- `<prefix>-variation-objects-v1`
- `<prefix>-independent-enabled-v1`
- `<prefix>-legacy-grid-archive-v1`

On first opt-in, the **currently active legacy rhythm mode** is converted to the new 3×8 bank, including saved one-/two-bar lengths, notes, snare dynamics and hi-hat articulations. Before conversion, **all four legacy grid banks** (straight, eighth-note triplets, sixteenth-note triplets and mixed), their dynamics/hat settings and two-bar data are archived. Legacy storage keys are not deleted or overwritten. This is important because one named legacy variation may contain different user-edited patterns in different global modes. We deliberately do not silently choose which conflicting versions to collapse into one variation.

If the user changes an independent variation's divisions, off-grid notes remain stored and playable. The editor and score flag these off-grid notes rather than silently deleting them.

## How to test

Launch the development pages with `?independent=1` to enable the new engine automatically:

- `https://raw.githack.com/verete28-ui/Groove-Machine/feature/per-variation-subdivision-engine/index.html?independent=1`
- `https://raw.githack.com/verete28-ui/Groove-Machine/feature/per-variation-subdivision-engine/one-drop.html?independent=1`
- `https://raw.githack.com/verete28-ui/Groove-Machine/feature/per-variation-subdivision-engine/variation-engine-demo.html`

The **new mode** is accessible through the 'חלוקה עצמאית לכל וריאציה' checkbox, persists across visits, and disables the legacy global subdivision selector. In the new sequencer every instrument has four independent beat-division selectors **per bar**; stop playback to edit beat divisions. Variation switching during playback takes effect at the beginning of the next complete cycle.

Suggested regression: set HH variation H5 to 4-4-4-4, H6 to 4-6-4-6; set SN to 4-4-4-4 and KD to 2-2-2-2. Switch H5→H6 while looping and confirm the underlying SN/KD times and their variation selection stay unchanged. Set HH length to two bars and verify one-bar SN/KD repeat in bar two. Test swing on duple beats and triplets on odd divisions. Then test real drum samples, closed/open hi-hat choking, meter, long-press length editing and VexFlow SVG on Android.

## Checks already completed

- 23 pure JS assertions for ticks, swing, migration, archiving contracts (legacy object non-mutation), two-bar repetition and serialize/deserialize.
- Two mock-DOM integration regressions (Groove Lab and One Drop) covering startup, selection, 12 beat selectors, edits, isolated per-machine storage, asynchronous variation switch on a simulated Web Audio clock, preserved SN/KD timestamps, and generated triplet groups through a VexFlow-compatible mock.
- Common core and both shell script dependencies verified.
- **Not yet completed:** real Chrome/Android audible playback, genuine VexFlow SVG visual check, storage upgrade with a populated end-user browser profile, and visual mobile two-bar fit. A mock Web Audio or VexFlow test cannot prove these.
- **No merge or production publish.**

## Scope boundary

No changes were made to One Drop H5/H6 song-specific notes, hats or instructional material. Those can be corrected separately, using this engine's new variation object schema.
