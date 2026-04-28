const router = require("express").Router();
const Booking = require("../models/Booking");
const Listing = require("../models/Listing");
const authMiddleware = require("../middleware/authMiddleware");


// ================= CREATE BOOKING =================
router.post("/create", authMiddleware, async (req, res) => {
  try {
    let { listingId, checkIn, checkOut } = req.body;

    // Convert to Date
    checkIn = new Date(checkIn);
    checkOut = new Date(checkOut);

    // 1. Validate dates
    if (!listingId || !checkIn || !checkOut) {
      return res.status(400).json({
        message: "All fields required"
      });
    }

    if (checkOut <= checkIn) {
      return res.status(400).json({
        message: "Invalid date range"
      });
    }

    // 2. Get listing
    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found"
      });
    }

    // 3. Prevent double booking (correct overlap logic)
    const existing = await Booking.findOne({
      listing: listingId,
      checkIn: { $lt: checkOut },
      checkOut: { $gt: checkIn }
    });

    if (existing) {
      return res.status(400).json({
        message: "Dates already booked"
      });
    }

    // 4. Calculate days
    const days = Math.ceil(
      (checkOut - checkIn) / (1000 * 60 * 60 * 24)
    );

    const totalPrice = days * listing.price;

    // 5. Create booking
    const booking = await Booking.create({
      user: req.user.id,
      listing: listingId,
      checkIn,
      checkOut,
      totalPrice
    });

    res.status(201).json({
      message: "Booking successful",
      booking
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// ================= GET USER BOOKINGS =================
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id
    }).populate("listing");

    res.json(bookings);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;