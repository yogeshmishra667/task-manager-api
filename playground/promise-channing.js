require("../src/db/mongoose");
const User = require("../src/models/user");

User.findByIdAndUpdate("5e90c38a6763e42d3c3e8e66", { age: 20 })
  .then((result) => {
    console.log(result);
    return User.countDocuments({ age: 20 });
  })
  .then((count) => {
    console.log(count);
  })
  .catch((err) => {
    console.log(err);
  });
