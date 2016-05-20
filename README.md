# Joust
[![Build Status](https://travis-ci.org/HearthSim/joust.svg?branch=master)](https://travis-ci.org/HearthSim/joust)

A web viewer for HearthStone games and replays, written in React.


## Requirements

- Node.js ~v5.7.0
- `npm install -g electron-prebuilt typings gulp webpack`


## Compiling

```
npm install
```

```
typings install
```

```
gulp compile:web
```


## Embedding

```html
<div id="container"></div>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/react/0.14.7/react.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/react/0.14.7/react-dom.min.js"></script>
<script type="text/javascript" src="bundle.js"></script>
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
