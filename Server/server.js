const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");

const app = express();

// =============================
// 🔹 Environment Variables
// =============================
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;
const ML_URL = process.env.ML_URL; 

// =============================
// 🔹 Middlewares
// =============================
app.use(express.json());
app.use(cors());

// =============================
// 🔹 Test Route
// =============================
app.get("/", (req, res) => {
  res.send("Node Server Running Successfully 🚀");
});

// =============================
// 🔹 Models
// =============================
const User = require("./modal/user");
const PredictionResponse = require("./modal/predictionResponseModal");

// =============================
// 🔹 1️⃣ Get Raw Data from MongoDB
// =============================
app.get("/ml-data", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =============================
// 🔹 2️⃣ Run ML Pipeline
// =============================
app.post("/run-ml", async (req, res) => {
  try {

    // 1️⃣ Send data to Flask
    const flaskResponse = await axios.post(
      `${ML_URL}/predict`,
      req.body, // sending client data
      {
        headers: {
          "Content-Type": "application/json"
        },
        timeout: 60000
      }
    );

    // 2️⃣ Get ML response
    const predictions = flaskResponse.data;

    console.log("ML Response:", predictions);

    // 3️⃣ Send response back to frontend
    res.status(200).json({
      success: true,
      data: predictions
    });

  } catch (error) {
    console.error("Error calling ML service:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to get ML prediction",
      error: error.message
    });
  }
});

// =============================
// 🔹 MongoDB Connection
// =============================
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully ✅");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err.message);
  });
