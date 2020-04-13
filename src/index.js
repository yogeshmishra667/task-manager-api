const express = require("express");
const app = express();
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
//const User = require("./models/user");
//const Task = require("./models/task");

const port = process.env.PORT || 3000;
app.use(express.json()); //it's automatically parse the incoming data for postman
app.use(userRouter); //for users router
app.use(taskRouter); //for tasks router

app.listen(port, () => {
  console.log(`🚀express server run on port ${port}`);
});
