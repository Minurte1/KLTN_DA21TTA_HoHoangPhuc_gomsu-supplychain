const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const uploadAndConvert = async (req, res, next) => {
  if (!req.file) return next();

  const inputPath = req.file.path;
  const outputPath = path.join(
    path.dirname(inputPath),
    path.basename(inputPath, path.extname(inputPath)) +
      "-" +
      Date.now() +
      ".webp"
  );

  try {
    await sharp(inputPath).webp({ quality: 80 }).toFile(outputPath);

    fs.unlink(inputPath, (err) => {
      if (err) {
        console.error("Failed to delete original file:", err);
      }
    });

    req.file.filename = path.basename(outputPath);
    req.file.path = outputPath;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadAndConvert };
