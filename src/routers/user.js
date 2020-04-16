const express = require("express");
const User = require("../models/user");
const router = new express.Router();
const auth = require("../middleware/auth");

/*<==================== NOTES =====================>*/

/*when you work at index.js (directly) you are use [app.get,post] but in this 
file you are used septate route file so you used [Router.get,post] */

router.post("/users", async (req, res) => {
  //console.log(req.body);
  const user = new User(req.body);
  try {
    await user.save(); /*in express doesn't want to return anything for async/await */
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
  // user.save().then((result) => {
  //    res.status(201).send(result);
  //   }).catch((err) => {
  //     res.status(400).send(err);
  //   });
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findOneCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken(); //for jwt token
    res.send({ user, token }); //add on database
  } catch (err) {
    res.status(400).send();
  }
});

//mongoose code for find users list
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
  // try {
  //   const users = await User.find({});
  //   res.send(users);
  // } catch (error) {
  //   res.status(500).send(err);
  // }

  // User.find({}).then((result) => {
  //     res.send(result);
  //   }).catch((err) => {
  //     res.status(500).send(err);
  //   });
});

//mongoose code for find specific users

router.get("/users/:id", async (req, res) => {
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
//for update users
router.patch("/users/:id", async (req, res) => {
  const update = Object.keys(req.body); //return array of the given object
  const allowedUpdate = ["name", "email", "age", "password"];
  const isValidOperation = update.every((user) => allowedUpdate.includes(user));
  /* every() check every value of function and include() given value include or not */
  if (!isValidOperation) {
    return res.status(400).send("entered invalid information 👎");
  }

  try {
    /*  //findByIdAndUpdate method byPass the mongoose 

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true,runValidators: true,});
    [pass req.body] it update dynamically for new check docs */

    //traditional way to update
    const user = await User.findById(req.params.id);
    update.forEach((data) => (user[data] = req.body[data])); //it's update users
    await user.save(); //save users

    if (!user) {
      //for if no user
      return res.status(404).send("user not found ");
    }
    res.send(user); //if request go well
  } catch (err) {
    res.status(400).send("server or validation error ⚠");
  }
});
//for delete users
router.delete("/users/:id", async (req, res) => {
  try {
    const users = await User.findByIdAndDelete(req.params.id);
    if (!users) {
      return res.status(404).send("user not found");
    }
    res.send("user deleted successfully..!");
  } catch (error) {
    res.status(400).send("server error", error);
  }
});

module.exports = router;
