require("../src/db/mongoose");
const Task = require("../src/models/task");

Task.findByIdAndDelete("5e90ccb7f5cd302bc85ac924")
  .then((result) => {
    console.log(result);
    return Task.countDocuments({ completed: true });
  })
  .then((count) => {
    console.log(count);
  })
  .catch((err) => {
    console.log(err);
  });
