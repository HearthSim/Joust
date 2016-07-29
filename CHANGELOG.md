# Joust Changelog
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Added
- Display full card when hovering minions
- Show warning to users of IE/Edge due to clip-path not being supported

### Changed
- Reduce the pause after card is drawn
- Tweak tooltips
- Remove the pause between cards played by Yogg-Sarron
- Increase width of play/pause button

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

[Unreleased]: https://github.com/HearthSim/joust/compare/0.2.0...HEAD
[0.2.0]: https://github.com/HearthSim/joust/compare/0.1.0...0.2.0
