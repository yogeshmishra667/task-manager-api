const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();

app.use(express.json()); //it's automatically parse the incoming data for postman
app.use(userRouter); //for users router
app.use(taskRouter); //for tasks router

//for testing create this file because testing want express application before listen is called

module.exports = app;
