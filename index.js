const path = require("path");
const fs = require("fs");

const Jimp = require("jimp");
const JPEG = require("jpeg-js");
const isImage = require("is-image");

Jimp.decoders['image/jpeg'] = (data) => JPEG.decode(data, { maxMemoryUsageInMB: 1024 });

fs.readdir("./", (err, files) => {
  if (err) {
    throw new Error(err);
  }

  const dirName = Date.now().toString();

  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }

  files.forEach((file) => {
    if (isImage(file)) {
      Jimp.read(file).then((img) => {
        const stats = fs.statSync(file);
        const initialSizeInBytes = stats.size;
        const newPath = path.join("./", dirName, `${file}.jpg`)

        img.resize(1200, 630)
          .quality(60)
          .write(newPath);

        setTimeout(() => {
          const statsNew = fs.statSync(newPath);
          const finalSizeInBytes = statsNew.size;
          const diff = ((finalSizeInBytes - initialSizeInBytes) / initialSizeInBytes) * 100;

          console.log(`${file}: ${displaySize(initialSizeInBytes)} --> ${displaySize(finalSizeInBytes)} (${diff.toFixed(2)} %)`);
        }, 10);
        
      }).catch((err) => {
        console.warn(err);
      })
    }
  });
});

const displaySize = (sizeInBytes) => {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} bytes`;
  } else if (sizeInBytes < (1024 * 1024)) {
    return `${parseInt(sizeInBytes / 1024)} KB`;
  } else {
    return `${parseInt(sizeInBytes / (1024 * 1024))} MB`;
  }
}
