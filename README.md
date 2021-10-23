<div align="center">

  <h1><code>thumbo-core</code></h1>

<strong> 😱 Dead fast thumbnail library for browser and NodeJs</strong>

[![Build & Test](https://github.com/ahkohd/thumbo-core/actions/workflows/build.yml/badge.svg)](https://github.com/ahkohd/thumbo-core/actions/workflows/build.yml)

<sub>Built with Rust 🦀 & WebAssembly 🕸</sub>

</div>

## 📖 About

`thumbo-core` is a thubnail library for browsers and NodeJs, built with Rust and WebAssembly in other to achieve closer to native speed!

It supports thumbnail generation for `Png`, `Jpeg`, `Gif`, `Ico`, `Webp` and `Svg`. `Webp` & `Svg` support is a work in progress.

> 📣 If you plan to use `thumbo-core`, it should be used with a Webworker so you don't block the main thread! If you don't want to go through this hassle, use [thumbo](https://github.com/ahkohd/thumbo), it provides a worker pool to handle thumbnail generation using `thumbo-core` out of the box.

## 🚴 Usage

### 🧪 Sample usage

```ts
import * as thumbo from "thumbo-core";

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
