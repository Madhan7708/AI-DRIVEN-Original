const mongoose = require("mongoose");

const predictionResponseSchema = new mongoose.Schema(
  {
    Timestamp: {
      type: String,
      required: true
    },
    State: {
      type: String,
      enum: ["ON", "OFF"],
      required: true
    }
  },
  {
    collection: "predictionresponse" // 👈 collection name
  }
);

module.exports = mongoose.model(
  "PredictionResponse",
  predictionResponseSchema
);