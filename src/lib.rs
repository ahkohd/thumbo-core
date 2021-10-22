mod utils;
use image;
use wasm_bindgen::prelude::*;
// use webp;

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
    Ico,
}

impl ImageFormat {
    pub fn to_image_format(&self) -> image::ImageFormat {
        match self {
            ImageFormat::Png => image::ImageFormat::Png,
            ImageFormat::Jpeg => image::ImageFormat::Jpeg,
            ImageFormat::Gif => image::ImageFormat::Gif,
            ImageFormat::Ico => image::ImageFormat::Ico,
        }
    }
}

#[wasm_bindgen]
pub fn thumbnail(image_bytes: Vec<u8>, format: ImageFormat, width: u32, height: u32) -> Vec<u8> {
    utils::set_panic_hook();
    let img = image::load_from_memory_with_format(&image_bytes, format.to_image_format())
        .expect("Error: Unable to load image");
    let resized_img = img.thumbnail(width, height);
    encode_img(&resized_img, format)
}

pub fn encode_img(img: &image::DynamicImage, format: ImageFormat) -> Vec<u8> {
    let mut result = vec![];
    img.write_to(&mut result, format.to_image_format()).unwrap();
    result
}
