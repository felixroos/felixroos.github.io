# blog

## TODO

### general

- [ ] dark / light switcher as icon
- [x] listen styles
- [x] table styles
- [ ] checkbox styles
- [ ] title image in frontmatter ausprobieren
- [ ] add prev / next post links
- [ ] add tag filters
- [ ] add similar posts (at least one common tag)
- [ ] "The ScriptProcessorNode is deprecated. Use AudioWorkletNode instead"
- [ ] "The AudioContext was not allowed to start. It must be resumed (or created) after a user gesture on the page."
- [ ] really keep system-ui ?
- [ ] try Typography.js
- [ ] look at twin.macro
- [ ] maybe replace material ui with antd?
- [ ] replace absolute links to felixroos.github.com/blog with relative links

### http://localhost:3000/svg-piano

- [x] remove hrs
- [ ] why can't i drag over the keys?

### http://localhost:3000/chords

- [ ] why can't i drag over the keys?

### http://localhost:3000/combinatorial-search

- [ ] post breaks when commenting in Analyzer component at top (post is still comprehensible)

### http://localhost:3000/animation

- [ ] yellow color is too bright..
- [ ] progress goes to 102%...

### http://localhost:3000/harmonics

- [ ] "It looks like there are several instances of `@material-ui/styles` initialized in this application.
      This may cause theme propagation issues, broken class names, specificity issues, and makes your application bigger without a good reason."
- [ ] "Warning: componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details"
- [ ] hovering does not start audiocontext - add button to start deliberately?
- [ ] when hovering the partial bars, sometimes they sound won't stop on mouse leave

### http://localhost:3000/intervals

## from old blog


### implement stateful tree walker

- [x] generator function that walks one node per call
- [x] enables "debugging" tree walker with Tree component
- [ ] could show different states on the side
- [ ] the generator could also be used to run inside a tone.js loop to "buffer" events as long as required
  - this would eliminate loop errors => for example, the first chord could then be voiced based on the last
  - the walker could be adjusted to be a "runtime", that allows jumps (to implement control flow)
  - maybe a zipper like implementation would then be needed
  - nevertheless, the stateful tree walker should still be implemented!!!

### PianoRoll

- add mode for PianoRoll where non-leaves are rendered => display bolero with group colors
- add mode for PianoRoll where nothing is scrolling, just the playhead is moving
- place non-scrolling PianoRoll with 0s on the left under the bolero score to replace colored bars
- auto select nodes in the graph while playing (to show correlation)

### Tree / RhythmInspector

- [x] adapt rhythmicalHierarchy, making it work with rhythmical objects too (currently array only) => r2d3
- add mode for Tree where clicking a node results in all the parent nodes being colored (+ node itself)
- add RhythmInspector, which is a rhythmical Tree that enables selecting nodes

## RhythmEditor

- add RhythmEditor, which is Player + JSON editor + RhythmInspector, that automatically updates
- Make RhythmInspector editable
  - nodes can be disabled (won't play + will loose color)
  - nodes can be edited => change value, set instrument, velocity, duration etc..

## Score

- improve Score component to allow rhythmical objects too (currently array only)
- improve Score component to show tuplets
- replace bolero.png with Score + color note heads + stems + beams according to group
