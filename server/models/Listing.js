const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
{
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("Listing", listingSchema);