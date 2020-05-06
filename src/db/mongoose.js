const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL, {
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
