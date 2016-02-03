# Joust

## Requirements

- Node.js ~v5.6.0
- `npm install -g electron-prebuilt typings gulp webpack`


## Install

Install dependencies:

```
npm install
```

Install additional TypeScript typings:

```
typings install
```

Compile and package:

```
gulp compile
```


## Run

```
electron .
```


## Development

Watch TypeScript with webpack:

```
webpack -d --watch
```

Watch HTML/LESS:

```
gulp watch
```


## Deployment

To package for web browsers:

```
gulp compile:web
```

Point browsers to `dist/index.html`.
