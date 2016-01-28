# Joust

## Requirements

- Node.js ~v5.3.0
- `npm install -g electron-prebuilt tsd gulp webpack`


## Install

Install dependencies:

```
npm install
```

Install additional TypeScript typings:

```
tsd install
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