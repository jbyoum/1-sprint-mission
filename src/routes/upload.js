import express from "express";
import asyncHandler from "../async-handler.js";
import multer from "multer";
import path from "path";
import { fileTypeFromFile } from "file-type";
import fs from "fs";

const __dirname = path.resolve();
const uploadRouter = express.Router();

const allowedExt = [
  "jpg",
  "j2c",
  "jp2",
  "jpm",
  "jpx",
  "png",
  "webp",
  "avif",
  "bmp",
  "gif",
  "icns",
  "ico",
];

const upload = multer({
  dest: path.join(__dirname, "files"),
  limits: { fieldNameSize: 100, fileSize: 2048 * 2048 },
});

uploadRouter
  .route("/")
  .get(
    asyncHandler(async (_, res) => {
      res.sendFile(__dirname + "/webpage/upload.html");
    })
  )
  .post(
    upload.single("attachment"),
    asyncHandler(async (req, res) => {
      const filePath = `${__dirname}/files/${req.file.filename}`;
      const mimeType = await fileTypeFromFile(filePath);
      const ext = mimeType["ext"];
      if (!allowedExt.includes(ext)) {
        fs.unlink(filePath);
        const e = new Error("Make sure you are uploading an image type.");
        e.name = "FileExtensionError";
        throw e;
      }
      const downloadPath = `${__dirname}/download/${req.file.filename}`;
      res.json({ downloadPath });
    })
  );

export default uploadRouter;
