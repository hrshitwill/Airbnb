const router = require("express").Router();
const mongoose = require("mongoose");
const Listing = require("../models/Listing");
const authMiddleware = require("../middleware/authMiddleware");


// ================= CREATE LISTING =================
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { title, description, price, location, image } = req.body;

    if (!title || !description || !price || !location || !image) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (price <= 0) {
      return res.status(400).json({
        message: "Price must be greater than 0"
      });
    }

    const listing = await Listing.create({
      title,
      description,
      price,
      location,
      image,
      owner: req.user.id
    });

    res.status(201).json({
      message: "Listing created successfully",
      listing
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// ================= GET ALL LISTINGS =================
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(listings);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// ================= GET SINGLE LISTING =================
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid ID"
      });
    }

    const listing = await Listing.findById(req.params.id)
      .populate("owner", "name email");

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found"
      });
    }

    res.json(listing);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;