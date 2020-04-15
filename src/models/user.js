const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("age must be positive number");
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
        throw new Error("email is not valid");
      }
    },
  },
  password: {
    type: String,
    trim: true,
    minlength: 7,
    validate(value) {
      if (value.includes("password")) {
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
});
//fot auth JWT
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "yogeshmishra");
  user.tokens = user.tokens.concat({ token }); //add token in tokens
  await user.save(); //save in database
  return token;
};

//for match email and password
userSchema.statics.findOneCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("unable to login");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("unable to login");
  }
  return user;
};

//hash the plain text before the save
userSchema.pre("save", async function (next) {
  const user = this; //you can access Name, Email, Password, etc.
  if (user.isModified("password")) {
    //isModified data modified or not
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
  /*next function call when function completed next function is must because if
   you can used next() function never call because it understand data in process */
});

const User = mongoose.model("User", userSchema);
/* put complete models object in userSchema */

// const me = new User({
//   name: "yogesh",
//   age: 20,
//   email: "yogeshmishra667@gmail.com   ",
//   password: "mishrayogi",
// });

// me.save()
//   .then(() => {
//     console.log(me);
//   })
//   .catch((err) => {
//     console.log("error", err);
//   });

module.exports = User;
