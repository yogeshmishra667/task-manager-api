//const express = require('express');

const app = require('./app');

//const app = express();
// require('./db/mongoose');
// const userRouter = require('./routers/user');
// const taskRouter = require('./routers/task');

const port = process.env.PORT;

// app.use(express.json()); //it's automatically parse the incoming data for postman
// app.use(userRouter); //for users router
// app.use(taskRouter); //for tasks router

app.listen(port, () => {
  console.log(`express server run on port ${port}`);
});

/* commented some code because same code available on app.js so also load on app.js in this file 🔥  */
