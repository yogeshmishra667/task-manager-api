const express = require("express");
const Task = require("../models/task");
const router = new express.Router();
const auth = require("../middleware/auth");

/*<==================== TASKS =====================>*/

router.post("/tasks", auth, async (req, res) => {
  //const task = new Task(req.body); //similar 🔻
  const task = new Task({
    ...req.body, //it copy all the req.body data
    owner: req.user._id, //added owner [user id] field in task model
  });
  try {
    const result = await task.save();
    res.status(201).send(result);
  } catch (err) {
    res.status(400).send(err);
  }
});
//fetch tasks list    // GET /tasks?completed=true
router.get("/tasks", auth, async (req, res) => {
  const match = {};
  if (req.query.completed) {
    match.completed = req.query.completed === "true";
    //match.completed want to string true not boolean ⏫
    //req.query.completed(string) === 'string' so match.completed(string)
  }

  try {
    //const task = await Task.find({ owner: req.user._id });  //optional way
    await req.user.populate({ path: "tasks", match: match }).execPopulate();
    res.send(req.user.tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});
//fetch individual tasks
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    // const task = await Task.findById(_id);
    const task = await Task.findOne({ _id, owner: req.user._id }); //if user logged in then only fetch tasks
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body); //return array of the given object
  const allowedUpdate = ["description", "completed"];
  const isValidOperation = updates.every((task) =>
    allowedUpdate.includes(task)
  );
  if (!isValidOperation) {
    return res.status(400).send("entered invalid information 👎");
  }

  try {
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true,});
    //used traditional ways update

    //const task = await Task.findById(req.params.id); //without auth
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    }); //with auth
    if (!task) {
      //if task not found
      return res.status(404).send("task not found");
    }

    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();

    res.send(task); //if request go well
  } catch (err) {
    res.status(400).send("server or validations error"); //server error
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    //const tasks = await Task.findByIdAndDelete(req.params.id); //without auth
    const tasks = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!tasks) {
      return res.status(404).send("task not found");
    }
    res.send(tasks);
  } catch (err) {
    res.status(400).send("server or validation error", err);
  }
});

module.exports = router;
