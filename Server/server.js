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
const ML_URL = process.env.ML_URL; // https://ml-service-d10o.onrender.com

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
app.get("/run-ml", async (req, res) => {
  try {
    // 1️⃣ Fetch data from MongoDB
    const users = await User.find();

    if (!users.length) {
      return res.status(400).json({
        message: "No user data found in database"
      });
    }

    // 2️⃣ Send data to Flask ML API
    const flaskResponse = await axios.post(
      `${ML_URL}/predict`,
      users
    );
    console.log("hello");
    console.log("Flask ML API Response:", flaskResponse.data);

    const predictions = flaskResponse.data;

    // 3️⃣ Store predictions in MongoDB
    const result = await PredictionResponse.insertMany(predictions);

    res.json({
      message: "ML Prediction completed and stored successfully ✅",
      totalStored: result.length
    });

  } catch (error) {
    console.error("ML Pipeline Error:", error.message);

    res.status(500).json({
      message: "Error running ML pipeline",
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
