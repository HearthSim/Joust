# Joust
[![Build Status](https://travis-ci.org/HearthSim/joust.svg?branch=master)](https://travis-ci.org/HearthSim/joust)

## Requirements

- Node.js ~v5.6.0
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
<script type="text/javascript" src="bundle.js"></script>
<script type="text/javascript">
	Joust.viewer('container').height(500).width(500).assets('images/').fromUrl('http://example.org/brawl.hsreplay');
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


## Licenses

The contents of this repository is licensed under the APGL, which can be found in the LICENSE file, with the following exceptions:

- The Belwe and Franklin Gothic are not licensed under APGL.
- The Font Awesome fonts at `assets/fonts/` are licensed under the SIL OFL 1.1.
- The Font Awesome LESS code at `less/font-awesome/` is licensed under the MIT license.