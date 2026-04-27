const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

dotenv.config();

const app = express();

// middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// test route
app.get("/", (req, res) => {
  res.json({ message: "Airbnb API Running" });
});

// database connect
app.use("/api/auth", require("./routes/auth"));
app.use("/api/listings", require("./routes/listing"));
mongoose.connect(process.env.MONGO_URL)
.then(() => {
  console.log("MongoDB Connected");
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
})
.catch((err) => console.log(err));