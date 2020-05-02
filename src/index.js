const express = require("express");
const app = express();
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
//const User = require("./models/user");
//const Task = require("./models/task");

const port = process.env.PORT || 3000;

// app.use((req, res, next) => {
//   if (req.method === "GET") {
//     res.send("GET request destroy");
//   } else {
//     next();
//   }
// });

// app.use((req, res, next) => {
//   res.status(503).send("server under construction please try after some time");
// });

app.use(express.json()); //it's automatically parse the incoming data for postman
app.use(userRouter); //for users router
app.use(taskRouter); //for tasks router

app.listen(port, () => {
  console.log(`express server run on port ${port}`);
});

//some practical
const Task = require("../src/models/task");
const User = require("../src/models/user");
const main = async () => {
  // const task = await Task.findById("5eadcd74f8451727d01a6299");
  // await task.populate("owner").execPopulate();
  // console.log(task.owner.name);
  const users = await User.findById("5eadca6f0fb930206c394a8a");
  await users.populate("tasks").execPopulate();
  console.log(users.tasks);
};
main();
