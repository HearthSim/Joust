# Joust Changelog
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Added
- Add loading screen messages
- Show Hero Power details on mouse over
- Various loading screen strings

### Fixed
- Show current stats when hovering entities
- Fix launcher example in README.md
- Fix default card art endpoint

### Changed
- Don't unexhaust hero powers when hovering
- Update README.md

## [0.5.0] - 2016-08-13
### Added
- Save replay speed preference in cookie
- Save ignore browser warning in cookie
- Unexhaust weapons and hero powers when hovering

### Changed
- Tweak text positioning
- Change timeline cursor (graphical)
- Improve performance when resizing applet horizontally

### Removed
- Remove proprietary fonts from source

### Fixed
- Changelog formatting
- Fix error when skipping back during Mulligan

## [0.4.0] - 2016-08-07
### Added
- Display keybindings in scrubber tooltips
- `Launcher.cardArt()` and `.assets()` can now accept a callback
- Ensure fullscreen does not error on unsupported devices (#123)
- Launcher: Add `.duration`, `.secondsWatched` and `.percentageWatched`

## [0.3.1] - 2016-08-01
### Fixed
- Fix minion hovering region for full card

## [0.3.0] - 2016-07-31
### Added
- Highlight cards that are swapped during Mulligan
- Display full card when hovering minions
- Show warning to users of IE/Edge due to clip-path not being supported
- Automatically run `typings install` on `npm install`
- Add Node v6.3 to supported versions

### Changed
- Reduce the pause after card is drawn
- Tweak tooltips
- Remove the pause between cards played by Yogg-Sarron
- Increase width of play/pause button
- Automatically download enums.d.ts on `npm install`

### Fixed
- Fix release URLs in Changelog

## [0.2.0] - 2016-07-28
### Added
- Metrics now contain a release tag
- Add tooltip when hovering secrets
- Add custom tooltips for scrubber buttons
- Lock screen orientation to landscape in fullscreen (#46)
- Display player concedes (#114)
- Add Changelog

### Changed
- Fully rework timings, greatly improving playback
- `Joust.release()` now reports a Semver string
- Prevent context menu in most places
- Reorder scrubber buttons

### Fixed
- Fix graphical glitch in timeline when Mulligan was very short

## 0.1.0 - 2016-07-25
### Added
- Code for initial development release

[Unreleased]: https://github.com/HearthSim/joust/compare/0.5.0...HEAD
[0.2.0]: https://github.com/HearthSim/joust/compare/0.1.0...0.2.0
[0.3.0]: https://github.com/HearthSim/joust/compare/0.2.0...0.3.0
[0.3.1]: https://github.com/HearthSim/joust/compare/0.3.0...0.3.1
[0.4.0]: https://github.com/HearthSim/joust/compare/0.3.1...0.4.0
[0.5.0]: https://github.com/HearthSim/joust/compare/0.4.0...0.5.0
