require("../src/db/mongoose");
const Task = require("../src/models/task");

// Task.findByIdAndDelete("5e90ccb7f5cd302bc85ac924")
//   .then((result) => {
//     console.log(result);
//     return Task.countDocuments({ completed: true });
//   })
//   .then((count) => {
//     console.log(count);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

const deleteAndUpdateTask = async (id, completed) => {
  const deleteTask = await Task.findByIdAndDelete(id); //id.id => id
  const countTask = Task.countDocuments({ completed }); //completed.completed =>
  return countTask;
};

deleteAndUpdateTask("5e904129fea0ff189c08ecad", true)
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });
