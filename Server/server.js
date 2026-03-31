const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");

const app = express();


const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;
const ML_URL = process.env.ML_URL;


app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Node Server Running Successfully");
});

const User = require("./modal/user");
const PredictionResponse = require("./modal/predictionResponseModal");

app.get("/DBdata", async (req, res) => { 
  try { 
    const users = await User.find();
     res.json(users); 
    }
     catch (error) { 
      res.status(500).json({ message: error.message }); 
    } 
  });


  app.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { State, Timestamp } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id, 
      { State, Timestamp }, 
      { returnDocument: 'after' } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
  app.get("/predictiondb", async (req, res) => {
    try {
      const predictions = await PredictionResponse.find();
 
      res.json(predictions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


app.post("/run-ml", async (req, res) => {
  try {

    const users = await User.find();

    // Send data to Flask
    const flaskResponse = await axios.post(
      `${ML_URL}/predict`,
      users,
      { timeout: 60000 }
    );

    const predictions = flaskResponse.data;


    // Store predictions
    const savedData = await PredictionResponse.insertMany(predictions);

    res.status(200).json({
      success: true,
      message: "Predictions stored successfully ✅",
      totalStored: savedData.length,
      data: savedData
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


mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully ");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} `);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err.message);
  });
