<div align="center">

  <h1><code>thumbo-core</code></h1>

  <strong> 😱 Dead fast thumbnail generation on the browser & NodeJs</strong>

  [![Build & Test](https://github.com/ahkohd/thumbo-core/actions/workflows/build.yml/badge.svg)](https://github.com/ahkohd/thumbo-core/actions/workflows/build.yml)

  <sub>Built with Rust 🦀 & WebAssembly 🕸</sub>
</div>

## 🚴 Usage
```ts
import * as thumbo_core from 'thumbo-core';

const img = await fetch("/path/to/img.png");

const thumbnail = thumbo.thumbnail(
        new Uint8Array(await img.arrayBuffer()),
        thumbo.ImageFormat.Png,
        20,
        20
);

const thumbnail_blob = new Blob([thumbnail], { type: "image/png" });
const url = URL.createObjectURL(thumbnail_blob);

document.getElementById("img").src = url;
```

## 👷🏽 Development

### 🛠️ Build with `wasm-pack build`

```
wasm-pack build
```

### 🔬 Test in Headless Browsers with `wasm-pack test`

```
wasm-pack test --headless --chrome
```

### 🎁 Publish to NPM with `wasm-pack publish`

```
wasm-pack publish
```
