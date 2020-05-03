const mongoose = require("mongoose");

const Task = mongoose.model("Task", {
  description: { type: String, required: true, trim: true },
  completed: { type: Boolean, default: false },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  // ref means reference that mean connect to other model
});

module.exports = Task;
