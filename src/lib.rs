mod utils;
use image;
use tiny_skia;
use usvg;
use wasm_bindgen::prelude::*;

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
    Svg,
}

impl ImageFormat {
    pub fn to_image_format(&self) -> image::ImageFormat {
        match self {
            ImageFormat::Png => image::ImageFormat::Png,
            ImageFormat::Jpeg => image::ImageFormat::Jpeg,
            ImageFormat::Gif => image::ImageFormat::Gif,
            ImageFormat::Ico => image::ImageFormat::Ico,
            ImageFormat::Svg => image::ImageFormat::Png,
        }
    }
}

fn generate_thumbnail(
    image_buffer: Vec<u8>,
    format: ImageFormat,
    width: u32,
    height: u32,
) -> Vec<u8> {
    match format {
        ImageFormat::Svg => generate_thumbnail_vector(image_buffer, width, height),
        _ => {
            let img = image::load_from_memory_with_format(&image_buffer, format.to_image_format())
                .unwrap();
            let resized_img = img.thumbnail(width, height);
            encode_img(&resized_img, format)
        }
    }
}

fn generate_thumbnail_vector(svg_text_buffer: Vec<u8>, width: u32, height: u32) -> Vec<u8> {
    let data = &svg_text_buffer[..];
    let tree = usvg::Tree::from_data(data, &usvg::Options::default().to_ref()).unwrap();
    let mut pixmap = tiny_skia::Pixmap::new(width, height).unwrap();
    resvg::render(&tree, usvg::FitTo::Width(width), pixmap.as_mut());
    pixmap.encode_png().unwrap()
}

pub fn encode_img(img: &image::DynamicImage, format: ImageFormat) -> Vec<u8> {
    let mut result = vec![];
    img.write_to(&mut result, format.to_image_format()).unwrap();
    result
}

#[wasm_bindgen]
pub fn thumbnail(image_buffer: Vec<u8>, format: ImageFormat, width: u32, height: u32) -> Vec<u8> {
    utils::set_panic_hook();
    generate_thumbnail(image_buffer, format, width, height)
}
