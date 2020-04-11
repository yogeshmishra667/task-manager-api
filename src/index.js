const express = require("express");
const app = express();
require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");

const port = process.env.PORT || 3000;
app.use(express.json()); //it's automatically parse the incoming data for postman

app.post("/users", (req, res) => {
  //console.log(req.body);
  const user = new User(req.body);

  user
    .save()
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.post("/tasks", (req, res) => {
  const task = new Task(req.body);
  task
    .save()
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.listen(port, () => {
  console.log(`🚀express server run on port ${port}`);
});
