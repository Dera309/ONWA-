/**
 * Downloads Bodoni Moda and Manrope font files from Google Fonts CDN
 * and saves them to public/fonts/ for self-hosting.
 * Run once: node scripts/download-fonts.js
 */
const https = require("https");
const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "../public/fonts");

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close();
          fs.unlinkSync(dest);
          return download(res.headers.location, dest).then(resolve).catch(reject);
        }
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          console.log("  Downloaded:", path.basename(dest));
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlinkSync(dest);
        reject(err);
      });
  });
}

const fonts = [
  // Bodoni Moda
  {
    url: "https://fonts.gstatic.com/s/bodonimoda/v22/aFT67PxzY382XsXX63LUXA2ieH368lg.woff2",
    dest: "BodoniModa-Regular.woff2",
  },
  {
    url: "https://fonts.gstatic.com/s/bodonimoda/v22/aFT67PxzY382XsXX63LUXAmieH368lg.woff2",
    dest: "BodoniModa-Medium.woff2",
  },
  {
    url: "https://fonts.gstatic.com/s/bodonimoda/v22/aFT67PxzY382XsXX63LUXBqieH368lg.woff2",
    dest: "BodoniModa-SemiBold.woff2",
  },
  {
    url: "https://fonts.gstatic.com/s/bodonimoda/v22/aFT67PxzY382XsXX63LUXBGieH368lg.woff2",
    dest: "BodoniModa-Bold.woff2",
  },
  // Manrope
  {
    url: "https://fonts.gstatic.com/s/manrope/v15/xn7gYHE41ni1AdIRggexSg.woff2",
    dest: "Manrope-Regular.woff2",
  },
  {
    url: "https://fonts.gstatic.com/s/manrope/v15/xn7gYHE41ni1AdIRggOxSg.woff2",
    dest: "Manrope-Medium.woff2",
  },
  {
    url: "https://fonts.gstatic.com/s/manrope/v15/xn7gYHE41ni1AdIRggSxSg.woff2",
    dest: "Manrope-SemiBold.woff2",
  },
  {
    url: "https://fonts.gstatic.com/s/manrope/v15/xn7gYHE41ni1AdIRggWxSg.woff2",
    dest: "Manrope-Bold.woff2",
  },
  {
    url: "https://fonts.gstatic.com/s/manrope/v15/xn7gYHE41ni1AdIRggexSg.woff2",
    dest: "Manrope-Light.woff2",
  },
];

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  console.log("Downloading fonts to", OUTPUT_DIR);
  for (const font of fonts) {
    const dest = path.join(OUTPUT_DIR, font.dest);
    if (fs.existsSync(dest)) {
      console.log("  Skipping (exists):", font.dest);
      continue;
    }
    try {
      await download(font.url, dest);
    } catch (e) {
      console.error("  FAILED:", font.dest, e.message);
    }
  }
  console.log("Done.");
}

main();
