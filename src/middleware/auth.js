const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const token = req.header('authorization').replace('Bearer ', ''); //it's replace bearar
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });

    if (!user) {
      throw new Error();
      //error catch by catch function
    }
    req.token = token; //for logout
    req.user = user; //for pass user models
    next();
  } catch (error) {
    res.status(403).send('please enter right password and username');
  }
};

module.exports = auth;
