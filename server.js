const express = require("express");
const mongoose = require("mongoose");
const app = express();

const PORT = 8000;
const MONGO_URI =
  "mongodb+srv://Madhan002:Madhan002@cluster0.qoyfb.mongodb.net/behaviouralpredictin";

app.use(express.json());

const User = require("../AI-DRIVEN-BEHAVIORAL-AND-MOTION-BASED-CONTROL-OF-ELECTRICAL-APPLIANCE/modal/userModal");
const PredictionResponse = require("../AI-DRIVEN-BEHAVIORAL-AND-MOTION-BASED-CONTROL-OF-ELECTRICAL-APPLIANCE/modal/predictionResponseModel");

// ✅ Routes
app.get("/", (req, res) => {
  res.send("Home Page");
});

app.get("/ml-data", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/ml-response", async (req, res) => {
  try {
    const predictions = req.body;

    if (!Array.isArray(predictions)) {
      return res.status(400).json({
        message: "Expected an array of prediction objects"
      });
    }

    console.log("📥 Received ML Prediction:");
    console.log(predictions);
    const result = await PredictionResponse.insertMany(predictions);

    res.status(200).json({
      message: "ML response received and stored successfully",
      totalPredictions: result.length
    });

  } catch (error) {
    res.status(500).json({
      message: "Error saving ML response",
      error: error.message
    });
  }
});

// ✅ MongoDB connection
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
