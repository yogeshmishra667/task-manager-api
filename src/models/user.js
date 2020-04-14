const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
});

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
