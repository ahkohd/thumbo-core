mod utils;
use wasm_bindgen::prelude::*;
use image;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub enum ImageFormat {
    Png,
    Jpeg,
    Gif,
    WebP,
    Ico,
}

impl ImageFormat  {
    pub fn to_image_format(&self) -> image::ImageFormat {
        match self {
            ImageFormat::Png => image::ImageFormat::Png,
            ImageFormat::Jpeg => image::ImageFormat::Jpeg,
            ImageFormat::Gif => image::ImageFormat::Gif,
            ImageFormat::WebP => image::ImageFormat::WebP,
            ImageFormat::Ico => image::ImageFormat::Ico,
        }
    }
}

#[wasm_bindgen(js_name = resizeImage)]
pub fn resize_image(image_bytes: Vec<u8>, format: ImageFormat, size: u32) -> Vec<u8> {
    utils::set_panic_hook();

    let img = image::load_from_memory_with_format(&image_bytes, format.to_image_format()).unwrap();
    let result = image::imageops::resize(&img, size, size,  image::imageops::FilterType::Nearest);
    result.to_vec()
}
