const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

// const Task = mongoose.model("Task", {
//   description: { type: String, required: true, trim: true },
//   completed: { type: Boolean, default: false },
// });

// const taskMe = new Task({
//   description: "start mongoose",
//   completed: true,
// });

// taskMe
//   .save()
//   .then(() => {
//     console.log(taskMe);
//   })
//   .catch((err) => {
//     console.log("error", err);
//   });
