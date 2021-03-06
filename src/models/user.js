const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Task = require('../models/task'); //for delete user tasks

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error('age must be positive number');
        }
      },
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      uppercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('email is not valid');
        }
      },
    },
    password: {
      type: String,
      trim: true,
      minlength: 7,
      validate(value) {
        if (value.includes('password')) {
          throw new Error("password doesn't enter whose easily guess ⚠");
        }
      },
    },
    //for add auth jwt token in database
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true, // for enable time and date
  }
);
// for virtually store it's not store in database
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner',
});

//for hide private data only show public data 🔽
userSchema.methods.toJSON = function () {
  // when we pass res.send express call BTS json.stringify
  const user = this;
  const userObject = user.toObject(); //it return object raw data
  delete userObject.password;
  delete userObject.tokens; //it delete tokens models
  delete userObject.avatar; //delete avatar from read profile
  return userObject;
};
//fot auth JWT
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token }); //add token in tokens
  await user.save(); //save in database
  return token;
};

//for match email and password
userSchema.statics.findOneCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('unable to login');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('unable to login');
  }
  return user;
};

//hash the plain text before the save
userSchema.pre('save', async function (next) {
  const user = this; //you can access Name, Email, Password, etc.
  if (user.isModified('password')) {
    //isModified data modified or not
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
  /*next function call when function completed next function is must because if
   you can used next() function never call because it understand data in process */
});

// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model('User', userSchema);
/* put complete models object in userSchema */

module.exports = User;
