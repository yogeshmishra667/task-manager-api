const express = require("express");
const app = express();
require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");

const port = process.env.PORT || 3000;
app.use(express.json()); //it's automatically parse the incoming data for postman

app.post("/users", async (req, res) => {
  //console.log(req.body);
  const user = new User(req.body);
  try {
    await user.save(); /*in express doesn't want to return anything for async/await */
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
  // user.save().then((result) => {
  //    res.status(201).send(result);
  //   }).catch((err) => {
  //     res.status(400).send(err);
  //   });
});

//mongoose code for find users list
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send(err);
  }

  // User.find({}).then((result) => {
  //     res.send(result);
  //   }).catch((err) => {
  //     res.status(500).send(err);
  //   });
});

//mongoose code for find specific users

app.get("/users/:id", async (req, res) => {
  /* id ==> provide by express for access dynamic route parameters*/
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    /* mongodb Query doesn't considered failure if don't get any result back
// that's means if user is not found mongodb is not provide error */
    if (!user) {
      res.status(404).send();
    }
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }

  // User.findById(_id).then((user) => {
  //     if (!user) {
  //       return res.status(404).send();
  //     }
  //     res.send(user);
  //   }).catch((err) => {
  //     res.status(500).send(err);
  //   });
});

app.patch("/users/:id", async (req, res) => {
  const update = Object.keys(req.body); //return array of the given object
  const allowedUpdate = ["name", "email", "age", "password"];
  const isValidOperation = update.every((user) => allowedUpdate.includes(user));
  /* every() check every value of function and include() given value include or not */
  if (!isValidOperation) {
    return res.status(400).send("entered invalid information 👎");
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    /* [pass req.body] it update dynamically for new check docs */
    if (!user) {
      //for if no user
      return res.status(404).send("user not found ");
    }
    res.send(user); //if request go well
  } catch (err) {
    res.status(400).send("server or validation error ⚠");
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const users = await User.findByIdAndDelete(req.params.id);
    res.send("user deleted successfully..!");
    if (!users) {
      return res.status(404).send("user not found");
    }
  } catch (error) {
    res.status(400).send("server error", error);
  }
});

app.post("/tasks", async (req, res) => {
  const task = new Task(req.body);
  try {
    const result = await task.save();
    res.status(201).send(result);
  } catch (err) {
    res.status(400).send(err);
  }

  // task.save().then((result) => {
  //     res.status(201).send(result);
  //   }).catch((err) => {
  //     res.status(400).send(err);
  //   });
});
//fetch tasks list
app.get("/tasks", async (req, res) => {
  try {
    const task = await Task.find({});
    res.send(task);
  } catch (err) {
    res.status(500).send(err);
  }

  // Task.find({}).then((task) => {
  //     res.send(task);
  //   }).catch((err) => {
  //     res.status(500).send(err);
  //   });
});
//fetch individual tasks
app.get("/tasks/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findById(_id);
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (err) {
    res.status(500).send(err);
  }

  // Task.findById(_id).then((task) => {
  //     if (!task) {
  //       res.status(404).send();
  //     }
  //     res.send(task);
  //   }).catch((err) => {
  //     res.status(500).send(err);
  //   });
});

app.patch("/tasks/:id", async (req, res) => {
  const updates = Object.keys(req.body); //return array of the given object
  const allowedUpdate = ["description", "completed"];
  const isValidOperation = updates.every((task) =>
    allowedUpdate.includes(task)
  );
  if (!isValidOperation) {
    return res.status(400).send("entered invalid information 👎");
  }

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      //if task not found
      return res.status(404).send("task not found");
    }
    res.send(task); //if request go well
  } catch (err) {
    res.status(400).send("server or validations error", err); //server error
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const tasks = await Task.findByIdAndDelete(req.params.id);
    res.send("task deleted successfully..!");
    if (!tasks) {
      return res.status(404).send("task not found");
    }
  } catch (err) {
    res.status(400).send("server or validation error", err);
  }
});

app.listen(port, () => {
  console.log(`🚀express server run on port ${port}`);
});
