require("../src/db/mongoose");
const User = require("../src/models/user");

// User.findByIdAndUpdate("5e90c38a6763e42d3c3e8e66", { age: 20 })
//   .then((result) => {
//     console.log(result);
//     return User.countDocuments({ age: 20 });
//   })
//   .then((count) => {
//     console.log(count);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

const userUpdateAndCount = async (id, age) => {
  /* you can also do without pass parameter */
  const update = await User.findByIdAndUpdate(id, {
    age,
  });
  const count = await User.countDocuments({ age });
  return count;
};

userUpdateAndCount("5e90c497f0386125e8c1950c", 200)
  .then((count) => {
    console.log(count);
  })
  .catch((err) => {
    console.log(err);
  });
