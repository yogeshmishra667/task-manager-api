const express = require('express');
const User = require('../models/user');
const router = new express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');

/*<==================== NOTES =====================>*/

/*when you work at index.js (directly) you are use [app.get,post] but in this 
file you are used septate route file so you used [Router.get,post] */

//upload images 🤞
const upload = multer({
  //dest: 'images',
  limits: { fileSize: 1000000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      // You can always pass an error if something goes wrong:
      cb(new Error('Please upload images file'));
    }
    // To accept the file pass `true`, like so:
    cb(null, true);
  },
});
router.post(
  '/users/me/avatar',
  auth,
  upload.single('avatar'),
  async (req, res) => {
    req.user.avatar = req.file.buffer; //file contain all file data
    await req.user.save(); //for save images in database
    console.log(req.file);
    res.send('images upload successfully');
  },
  (error, req, res, next) => {
    //express understand this middleware for error handling
    res.status(400).send({ error: error.message });
  }
);

//delete images
router.delete(
  '/users/me/avatar',
  auth,
  async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send('images deleted successfully');
  },
  (error, req, res, next) => {
    //express understand this middleware for error handling
    res.status(400).send({ error: error.message });
  }
);

//fetch images for user
//http://localhost:3000/users/5eafed5c429cb83c787879f4/avatar see on browser
router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set('Content-Type', 'image/jpg');
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

router.post('/users', async (req, res) => {
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

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findOneCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken(); //for jwt token
    res.send({ user: user.getPublicData(), token }); //add on database //getPublicData hide private data
  } catch (err) {
    res.status(400).send();
  }
});
//user ⏪ logout
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      // console.log(token.token);
      return token.token !== req.token;
    });
    await req.user.save();
    res.send('users logout');
  } catch (error) {
    res.status(500).send();
  }
});

//logout all ♻ users
router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    //console.log(req.user);
    req.user.tokens = [];
    await req.user.save();
    res.send('all users logout');
  } catch (error) {
    res.status(500).send();
  }
});

//mongoose code for find users list
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
});

//mongoose code for find specific users
//no need this one same work 👆 get request

// router.get("/users/:id", async (req, res) => {
//   /* id ==> provide by express for access dynamic route parameters*/
//   const _id = req.params.id;
//   try {
//     const user = await User.findById(_id);
//     /* mongodb Query doesn't considered failure if don't get any result back
// // that's means if user is not found mongodb is not provide error */
//     if (!user) {
//       res.status(404).send();
//     }
//     res.send(user);
//   } catch (err) {
//     res.status(500).send(err);
//   }

// });
//for update users
router.patch('/users/me', auth, async (req, res) => {
  const update = Object.keys(req.body); //return array of the given object
  const allowedUpdate = ['name', 'email', 'age', 'password'];
  const isValidOperation = update.every((user) => allowedUpdate.includes(user));
  /* every() check every value of function and include() given value include or not */
  if (!isValidOperation) {
    return res.status(400).send('entered invalid information 👎');
  }

  try {
    /*  //findByIdAndUpdate method byPass the mongoose 

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true,runValidators: true,});
    [pass req.body] it update dynamically for new check docs */

    //traditional way to update
    //const user = await User.findById(req.user._id);

    update.forEach((data) => (req.user[data] = req.body[data])); //it's update users
    await req.user.save(); //save users

    res.send(req.user); //if request go well
  } catch (err) {
    res.status(400).send('server or validation error ⚠');
  }
});
//for delete users
// change id to me because user can delete only own profile
router.delete('/users/me', auth, async (req, res) => {
  try {
    //no need id for delete user because auth also take user id
    await req.user.remove();
    return res.status(200).send(req.user);
  } catch (error) {
    res.status(400).send('server error', error);
  }
});

module.exports = router;
