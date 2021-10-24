import * as thumbo from "thumbo-core";

const TEST_IMAGE_PATH = "../images/content/passport.jpg";
const THUMBNAIL_SIZE = 20;

const scores = {
  "stats-wasm": [],
  "stats-wasm-read": [],
  stats: [],
};

const chartCtx = document.getElementById("chart");

const chart = new Chart(chartCtx, {
  type: "line",
  data: {
    labels: [],
    datasets: Object.entries(scores).map(([key, data]) => ({
      label: key,
      data,
      fill: false,
      borderColor: (() => {
        switch (key) {
          case "stats-wasm":
            return "rgba(255, 99, 132, 1)";
          case "stats-wasm-read":
            return "rgba(54, 162, 235, 1)";
          case "stats":
            return "rgba(255, 206, 86, 1)";
        }
      })(),
      tension: 0.1,
    })),
  },
});

document.getElementById("convert-wasm").addEventListener("click", async () => {
  const image_buffer = await fetchTestImage();

  const t0 = performance.now();
  const thumbnail_buffer = thumbo.thumbnail(
    image_buffer,
    thumbo.ImageFormat.Jpeg,
    THUMBNAIL_SIZE,
    THUMBNAIL_SIZE
  );
  const t1 = performance.now();

  const blob = new Blob([thumbnail_buffer], { type: "image/jpg" });
  const url = URL.createObjectURL(blob);
  document.getElementById("result-wasm").src = url;

  logPerformanceStats(
    t0,
    t1,
    image_buffer.length,
    blob.size,
    "stats-wasm",
    "With WASM (clone)"
  );
});

document
  .getElementById("convert-wasm-read")
  .addEventListener("click", async () => {
    const image_buffer = await fetchTestImage();

    const t0 = performance.now();
    const thumbnail_result = thumbo.thumbnailFromMemory(
      image_buffer,
      thumbo.ImageFormat.Jpeg,
      THUMBNAIL_SIZE,
      THUMBNAIL_SIZE
    );
    const t1 = performance.now();

    const blob = new Blob([read(thumbnail_result)], { type: "image/jpg" });
    const url = URL.createObjectURL(blob);
    document.getElementById("result-wasm-read").src = url;

    logPerformanceStats(
      t0,
      t1,
      image_buffer.length,
      blob.size,
      "stats-wasm-read",
      "With WASM (read from memory)"
    );
  });

document.getElementById("convert").addEventListener("click", async () => {
  const image_buffer = await fetchTestImage();
  const img = new Image();
  img.src = TEST_IMAGE_PATH;

  img.onload = async () => {
    const t0 = performance.now();

    const targetWidth = THUMBNAIL_SIZE;
    const targetHeight = THUMBNAIL_SIZE;
    const targetRatio = targetWidth / targetHeight;
    const sourceRatio = img.width / img.height;
    let resizeWidth, resizeHeight;

    if (sourceRatio >= targetRatio) {
      resizeWidth = targetWidth;
      resizeHeight = resizeWidth / sourceRatio;
    } else {
      resizeHeight = targetHeight;
      resizeWidth = resizeHeight * sourceRatio;
    }

    const thumbnail_bitmap = await createImageBitmap(img, {
      resizeWidth,
      resizeHeight,
      resizeQuality: "high",
    });

    const canvas = document.createElement("canvas");
    canvas.width = resizeWidth;
    canvas.height = resizeHeight;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(thumbnail_bitmap, 0, 0);

    const t1 = performance.now();

    canvas.toBlob(
      (blob) => {
        let url = URL.createObjectURL(blob);
        document.getElementById("result").src = url;

        logPerformanceStats(
          t0,
          t1,
          image_buffer.length,
          blob.size,
          "stats",
          "Without WASM"
        );
      },
      {
        type: "image/jpeg",
        quality: 1,
      }
    );
  };
});

const fetchTestImage = async () => {
  const img = await fetch(TEST_IMAGE_PATH);
  return new Uint8Array(await img.arrayBuffer());
};

const bytesToSize = (bytes) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return "0 Byte";
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
};

const logPerformanceStats = (
  t0,
  t1,
  inputSizeInBytes,
  outputSizeInBytes,
  target,
  tag
) => {
  let seconds = (t1 - t0) / 1000;
  scores[target].push(seconds);
  let avg = scores[target].reduce((a, b) => a + b, 0) / scores[target].length;

  document.getElementById(target).innerText = `${tag}: Took ${seconds.toFixed(
    2
  )} seconds. Avg: ${avg.toFixed(2)} seconds. Rounds: ${
    scores[target].length
  }. seconds Input: ${bytesToSize(inputSizeInBytes)} -> Output: ${bytesToSize(
    outputSizeInBytes
  )} `;

  // update chart series..
  const len = chart.data.labels.length;
  const max = Math.max(...Object.values(scores).map((value) => value.length));
  if (max > len) {
    chart.data.labels.push(len + 1);
  }
  chart.update();
};

const read = (result) => {
  return new Uint8Array(thumbo.memory.buffer, result.img_ptr, result.img_size);
};
