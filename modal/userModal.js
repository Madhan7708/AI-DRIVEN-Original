const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    Timestamp: String, 
    State: String
},
  {
    collection: "predicition" // ✅ EXACT name from Atlas
  }
);

module.exports = mongoose.model("User", userSchema);
