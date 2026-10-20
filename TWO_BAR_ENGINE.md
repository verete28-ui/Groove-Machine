# Groove Lab — two-bar engine development

## Scope
This branch is a development candidate, not the production release. Do not merge before user acceptance on mobile. No One Drop musical presets or patterns were changed.

## Engine contract
- `variationLengths[3][8]` stores 1 or 2 bars for every instrument variation, independently of the currently chosen grid.
- `cycleBars()` is 2 whenever any **selected** variation is two bars, otherwise 1.
- `patternFor(instrument, bar, variation)` returns the existing first bar for bar 0 or when the variation is one bar. Otherwise it resolves an independently editable second bar.
- `secondBarData[grid]` contains second-bar patterns, snare dynamics and hi-hat articulations for the straight, eighth-triplet, sixteenth-triplet and mixed grids. Existing first-bar storage keys remain untouched.
- Bar-1 instruments repeat their first bar when the engine plays bar 2; two-bar instruments play their own stored second bar.
- The scheduler advances continuously through 1 or 2 bars; queued A–H changes and beat-grid changes apply at the first bar of the next cycle.
- In mixed mode, each bar retains 48 timing ticks, 12 per quarter. The second bar has independently stored subdivision choices.
- Score rendering creates a separate notation system for each displayed bar, preserving VexFlow tuplets, snare accents/ghosts and circled X open hi-hat.
- The sequencer stacks two groups of HH / SN / KD when needed. A one-bar combination retains the original single-bar layout.

## Storage keys added
- `groove-lab-variation-lengths-v1`
- `groove-lab-second-bar-data-v1`
- `groove-lab-second-bar-subdivisions-v1`

## Tested in JS runtime with stubbed DOM and VexFlow
- Default combination renders one bar.
- Making HH B two bars displays two panels.
- The second HH bar is a distinct pattern array, while one-bar SN and KD repeat the original array.
- Editing second-bar HH does not alter first-bar HH.
- Switching subdivision on the second bar leaves first-bar subdivisions unchanged.
- Continuous scheduler emits 16 steps of bar 1, followed by 16 of bar 2, returning to bar 1 seamlessly at straight 4/4.
- Score construction successfully generates one and two systems for grids of 16, 12, 24 and 48 steps; mock notation draws without exceptions.

## Acceptance still required
1. Test real sound, beat-grid changes and A–H transitions in Chrome/Android (not only a mock).
2. Check two full bars on a narrow phone screen without horizontal scrolling.
3. Check VexFlow tuplets/accents/circled X visually with real fonts.
4. Verify user data upgrade and restoration from existing localStorage.
5. Only after acceptance, merge this branch into main.

## Future machine presets
Specific One Drop, Steppers and Rockers teaching patterns remain outside this shared-engine upgrade.
