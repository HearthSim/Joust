# Joust
[![Travis](https://img.shields.io/travis/HearthSim/joust.svg)](https://travis-ci.org/HearthSim/joust)
[![GitHub release](https://img.shields.io/github/release/HearthSim/joust.svg)](https://github.com/HearthSim/joust/releases)

A web viewer for HearthStone games and replays, written in React.


## Requirements

- Node.js ~v5.7.0
- Compiling: `npm install -g typings gulp webpack`
- Development: `npm install -g electron-prebuilt typings gulp webpack`


## Compiling

```
npm install
```

```
typings install
```

```
gulp compile
```


## Embedding

```html
<div id="container"></div>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/react/15.2.1/react.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/react/15.2.1/react-dom.min.js"></script>
<script type="text/javascript" src="joust.js"></script>
<script type="text/javascript">
	Joust.viewer("container").height(500).width(500).assets("assets/").fromUrl("//example.org/brawl.hsreplay");
</script>
```

Don't forget to include the stylesheet and the assets.


## Development

Watch TypeScript with webpack:

```
webpack -d --watch
```

Watch HTML/LESS:

```
gulp watch
```


## License

Copyright © HearthSim. All Rights Reserved.

### Third party assets

- The Belwe and Franklin Gothic fonts are under their own, respective licenses.
- The Font Awesome font is licensed under the SIL OFL 1.1.
- The Font Awesome style code is licensed under the MIT license.
- Some Hearthstone textures are copyright © Blizzard Entertainment


## Community

This is a [HearthSim](https://hearthsim.info) project. All development
happens on our IRC channel `#hearthsim` on [Freenode](https://freenode.net).
