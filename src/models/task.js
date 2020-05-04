const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    // ref means reference that mean connect to other model
  },
  {
    timestamps: true, // for enable time and date
  }
);
const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
