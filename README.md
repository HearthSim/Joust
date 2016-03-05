# Joust
[![Build Status](https://travis-ci.org/HearthSim/joust.svg?branch=master)](https://travis-ci.org/HearthSim/joust)

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
	Joust.viewer('container').height(500).width(500).assets('assets/').fromUrl('http://example.org/brawl.hsreplay');
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

Joust is licensed under the AGPLv3 for **non-commercial uses exclusively**.
The full text of the license can be found in the LICENSE file.

Joust is not licensed for commercial use. Commercial exceptions can be granted
on a case by case basis.

### Third party software

- The Belwe and Franklin Gothic fonts are under their own, respective licenses.
- The Font Awesome font is licensed under the SIL OFL 1.1.
- The Font Awesome style code is licensed under the MIT license.
