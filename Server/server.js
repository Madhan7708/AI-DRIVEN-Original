const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URI =
  "mongodb+srv://Madhan002:Madhan002@cluster0.qoyfb.mongodb.net/behaviouralpredictin";

app.use(express.json());

const User = require("./modal/user");
const PredictionResponse = require("./modal/predictionResponseModal");

// 🔹 1. Get Raw Data
app.get("/ml-data", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// 🔹 2. Run ML Pipeline
app.get("/run-ml", async (req, res) => {
  try {

    // 1️⃣ Fetch data from MongoDB
    const users = await User.find();

    // 2️⃣ Send data to Flask API
    const flaskResponse = await axios.post(
      "http://localhost:5000/predict",
      users
    );

    const predictions = flaskResponse.data;
    console.log(predictions);
    // 3️⃣ Store predictions in MongoDB
   
     const result = await PredictionResponse.insertMany(predictions);
    res.json({
      message: "ML Prediction completed and stored successfully",
      totalStored: result.length
    });

  } catch (error) {
    res.status(500).json({
      message: "Error running ML pipeline",
      error: error.message
    });
  }
});


// 🔹 MongoDB Connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err.message);
  });
