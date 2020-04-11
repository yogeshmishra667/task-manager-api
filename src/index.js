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
//mongoose code for find users list
app.get("/users", (req, res) => {
  User.find({})
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

//mongoose code for find specific users
app.get("/users/:id", (req, res) => {
  /* id ==> provide by express for access dynamic route parameters*/
  const _id = req.params.id;
  User.findById(_id)
    .then((user) => {
      /* mongodb Query doesn't considered failure if don't get any result back
    // that's means if user is not found mongodb is not provide error */
      if (!user) {
        return res.status(404).send();
      }
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send(err);
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
//fetch tasks list
app.get("/tasks", (req, res) => {
  Task.find({})
    .then((task) => {
      res.send(task);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});
//fetch individual tasks
app.get("/tasks/:id", (req, res) => {
  const _id = req.params.id;
  Task.findById(_id)
    .then((task) => {
      if (!task) {
        res.status(404).send();
      }
      res.send(task);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});
app.listen(port, () => {
  console.log(`🚀express server run on port ${port}`);
});
