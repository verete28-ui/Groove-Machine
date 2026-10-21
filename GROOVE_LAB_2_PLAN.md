# Groove Lab 2.0 — development track

## Status (2026-10-21)
An isolated development entry point is at `groove-lab-2.html` on this branch.
This is a **foundation, not the finished product**. It is derived from the existing Groove Lab shell and reuses `variation-engine.js` and `engine/groove-core.js`. The independent variation mode is enabled via the URL flag at first navigation.
Production `index.html`, `one-drop.html`, and deployed GitHub Pages remain unchanged.

## Preserve previous project decisions
- GitHub is the source of truth; no parallel in-chat drum machine.
- Separate pedagogical machines: One Drop, Rockers, Steppers, with one shared engine.
- Eight meaningful variations per lane (A–H), designed as a teaching progression, not arbitrary patterns.
- Independent beat divisions per variation and per bar: 2/3/4/6 subdivisions per quarter, 12 internal ticks per beat.
- One- and two-bar patterns; one-bar lanes repeat across a two-bar phrase.
- Tap-to-edit while playing; switch variations at phrase boundaries; changes never mutate other instruments.
- Full-pattern at-a-glance view without horizontal scrolling; editable mobile UI.
- Mute independent of note data; clear click practice mode; notation follows same underlying notes.
- 100 BPM and 60 swing are the requested One Drop session defaults, not a global requirement for all genres.

## Development sequence
1. **Baseline**: preserve and execute existing automated tests on the new branch; audit start/stop, off-grid notes, swing and 2-bar rendering on real Android Chrome. No claim of device verification before it occurs.
2. **Extract architecture**: split large groove-core module into audio scheduler, variation state, UI editor, notation, storage; preserve existing storage compatibility and automatic migration.
3. **New learning-first UI**: always-visible variation mixing and full pattern; secondary edit pane; practice controls; compact phone viewport. Avoid an untested wholesale UI replacement.
4. **Musical content**: transcribe and check One Drop hi-hat including the specified asymmetric two-bar division; restore the original A–H library before designing H5/H6. Add Rockers and Steppers as separate machine definitions.
5. **Quality**: regression tests for queued switches, audible edits, kick/snare timestamp invariance, storage migration and off-grid notes. Human listening and VexFlow/mobile screen verification remain required.
6. **Release** only after review to main and explicit deployment.

## Preview
`https://raw.githack.com/verete28-ui/Groove-Machine/feature/groove-lab-2/groove-lab-2.html`

This preview may be cached and must not be confused with the production GitHub Pages release.
