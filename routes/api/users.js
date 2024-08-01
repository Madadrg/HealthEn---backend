const express = require("express");
const multer = require("multer");
const jimp = require("jimp");
const path = require("path");
const fs = require("fs").promises;
const User = require("../../models/user");

const router = express.Router();
const upload = multer({ dest: "tmp/" });

router.patch("/avatars", upload.single("avatar"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { path: tempPath, originalname } = req.file;
    const ext = path.extname(originalname);
    const newFileName = `${req.user._id}${ext}`;
    const newPath = path.join(__dirname, "../../public/avatars", newFileName);

    const image = await jimp.read(tempPath);
    await image.resize(250, 250).writeAsync(tempPath);
    await fs.rename(tempPath, newPath);

    const avatarURL = `/avatars/${newFileName}`;
    req.user.avatarURL = avatarURL;
    await req.user.save();

    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
