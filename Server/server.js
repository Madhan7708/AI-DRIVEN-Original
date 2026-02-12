const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");

const app = express();

// =============================
// 🔹 Cache for ML Results
// =============================
let mlCache = {
  data: null,
  timestamp: null,
  CACHE_DURATION: 3600000 // 1 hour in milliseconds
};

function isCacheValid() {
  return mlCache.data && (Date.now() - mlCache.timestamp < mlCache.CACHE_DURATION);
}

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
// 🔹 Utility: Retry with Exponential Backoff
// =============================
async function makeRequestWithRetry(url, data, maxRetries = 3, initialDelay = 1000) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await axios.post(url, data);
    } catch (error) {
      if (error.response?.status === 429 && attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        console.log(`Rate limited. Retrying in ${delay}ms... (Attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}

// =============================
// 🔹 2️⃣ Run ML Pipeline
// =============================
app.get("/run-ml", async (req, res) => {
  try {
    // Check cache first (optional optimization)
    if (isCacheValid()) {
      return res.json({
        message: "ML Prediction retrieved from cache ⚡",
        totalStored: mlCache.data.length,
        cached: true
      });
    }

    // 1️⃣ Fetch data from MongoDB
    const users = await User.find();

    if (!users.length) {
      return res.status(400).json({
        message: "No user data found in database"
      });
    }

    // 2️⃣ Send data to Flask ML API with retry logic
    const flaskResponse = await makeRequestWithRetry(
      `${ML_URL}/predict`,
      users,
      3,  // max 3 retries
      1000  // start with 1 second delay
    );

    const predictions = flaskResponse.data;

    // 3️⃣ Store predictions in MongoDB
    const result = await PredictionResponse.insertMany(predictions);

    // 4️⃣ Update cache
    mlCache.data = result;
    mlCache.timestamp = Date.now();

    res.json({
      message: "ML Prediction completed and stored successfully ✅",
      totalStored: result.length,
      cached: false
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
