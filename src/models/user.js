const mongoose = require("mongoose");
const validator = require("validator");

const User = mongoose.model("User", {
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
