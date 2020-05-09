const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

//create test users
userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: 'yogi',
  email: 'yogijs667@gmail.com',
  password: 'yogi123!!',
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET), //for generate new token
    },
  ],
};
//create second testing user
const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: 'Jess',
  email: 'jess@example.com',
  password: 'myhouse099@@',
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    },
  ],
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: 'First task',
  completed: false,
  owner: userOne._id,
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Second task',
  completed: true,
  owner: userOne._id,
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Third task',
  completed: true,
  owner: userTwo._id,
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

/* NOTES => when you login it's pass first time but test fail another ⏲ because database not accept duplicate value so solve this problem jest provide helper func() it's clear database before user added so delete for user must need User model with mongoose () */

module.exports = {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase,
};

//Qus--: why create db.js  file🗄
/*first things advantages to doing this code reusability because also task testing want to user who 
create task.. if i can't create db.js then i want to write same code in both file
*/
