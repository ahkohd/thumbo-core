//! Test suite for the Web and headless browsers.

#![cfg(target_arch = "wasm32")]

extern crate wasm_bindgen_test;

use wasm_bindgen_test::*;
use image;
use std::env;

wasm_bindgen_test_configure!(run_in_browser);

fn abs_path(path: &str) -> String {
    format!(
        "{}/tests/{}",
        str::replace(env::current_dir().unwrap().to_str().unwrap(), "\"", ""),
        path
    )
}

#[wasm_bindgen_test]
fn test_thumbnail() {
    let img_bytes = image::open(abs_path("./test.png")).unwrap().to_bytes();
    let thumbnail = thumbo_core::thumbnail(img_bytes, thumbo_core::ImageFormat::Png, 20, 20);
    assert!(thumbnail);
}
