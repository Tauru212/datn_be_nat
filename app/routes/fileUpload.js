import express from "express";
const router = express.Router();

import multer from "multer";
import { conn } from "../../server.js";

var path = "";

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    path = Date.now() + "_" + Math.round(Math.random() * 1e9) + ".png";
    cb(null, path);
  },
});
let upload = multer({ storage: storage });

router.post("/", upload.single("file"), (req, res) => {
  try {
    console.log('path image = ' + path);
    let data = {
      success: true,
      message: "file upload successful",
      data: {
        path: path,
      },
    };
    res.status(200).json(data);
  } catch (error) {
    let data = {
      success: false,
      message: error.message,
      data: null,
    };
    res.status(500).json(data);
  }
});

export default router;
