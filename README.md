# Joust

Hearthstone replays in your browser, written in Typescript with React.

## Requirements

- Node.js
- Development: `npm install -g electron-prebuilt gulp webpack`
- [pnpm](https://pnpm.io/): `corepack enable`

## Building

```
$ pnpm install --frozen-lockfile
$ gulp compile
```

## Usage

```html
<div id="joust-container"></div>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/react/15.4.0/react.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/react/15.4.0/react-dom.min.js"></script>
<link rel="stylesheet" href="joust.css"></link>
<script type="text/javascript" src="joust.js"></script>
<script type="text/javascript">
	Joust.launcher("joust-container")
		.height(500)
		.width(500)
		.fromUrl("//example.org/brawl.hsreplay");
</script>
```

[Full documentation](https://github.com/HearthSim/Joust/wiki/Embedding).

Joust does not do any polyfilling and expects the globals Promise and fetch to be available.

## Development

```
$ pnpm dev
```

## Electron

With `pnpm dev` running, start Electron in a new terminal tab:

```
$ pnpm exec electron .
```

## License

Copyright © HearthSim. All Rights Reserved.

### Third party assets

- The Font Awesome font is licensed under the SIL OFL 1.1.
- The Font Awesome style code is licensed under the MIT license.
- Some Hearthstone textures are copyright © Blizzard Entertainment
