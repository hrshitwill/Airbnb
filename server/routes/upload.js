const router = require("express").Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const result = await cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) return res.status(500).json(error);
        res.json({ url: result.secure_url });
      }
    );

    result.end(req.file.buffer);

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;