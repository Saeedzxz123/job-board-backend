const mongoose = require("mongoose")

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  cvUrl: {
    type: String,
    required: true
  }
}, {timestamps: true})

module.exports = mongoose.model("Application", applicationSchema)