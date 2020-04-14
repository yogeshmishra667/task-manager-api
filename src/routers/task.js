const express = require("express");
const Task = require("../models/task");
const router = new express.Router();

/*<==================== NOTES =====================>*/

/*when you work at index.js (directly) you are use [app.get,post] but in this 
file you are used septate route file so you used [Router.get,post] */

router.post("/tasks", async (req, res) => {
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
router.get("/tasks", async (req, res) => {
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
router.get("/tasks/:id", async (req, res) => {
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

router.patch("/tasks/:id", async (req, res) => {
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
    const task = await Task.findById(req.params.id);
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();

    if (!task) {
      //if task not found
      return res.status(404).send("task not found");
    }
    res.send(task); //if request go well
  } catch (err) {
    res.status(400).send("server or validations error"); //server error
  }
});

router.delete("/tasks/:id", async (req, res) => {
  try {
    const tasks = await Task.findByIdAndDelete(req.params.id);
    if (!tasks) {
      return res.status(404).send("task not found");
    }
    res.send(tasks);
  } catch (err) {
    res.status(400).send("server or validation error", err);
  }
});

module.exports = router;
