const request = require('supertest');
const app = require('../src/app');
const jwt = require('jsonwebtoken'); //for create token
const mongoose = require('mongoose'); //for new object id

const User = require('../src/models/user');

/* NOTES => when you login it's pass first time but test fail another ⏲ because database not accept duplicate value so solve this problem jest provide helper func() it's clear database before user added so delete for user must need User model with mongoose () */

//create test users
createObjectId = new mongoose.Types.ObjectId();
const createOne = {
  _id: createObjectId,
  name: 'yogi',
  email: 'yogijs667@gmail.com',
  password: 'yogi123!!',
  tokens: [
    {
      token: jwt.sign({ _id: createObjectId }, process.env.JWT_SECRET), //for generate new token
    },
  ],
};

//delete and add test user before perform test operation
beforeEach(async () => {
  await User.deleteMany(); //clear user collection
  await new User(createOne).save(); //added test user
});
//user signup testing
test('Should signup a new user', async () => {
  const response = await request(app)
    .post('/users')
    .send({
      name: 'yogesh mishra',
      email: 'yogesh@mishra.com',
      password: '123456789',
    })
    .expect(201);

  //advance assert testing
  // Assert that the database was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // Assertions about the response
  expect(response.body).toMatchObject({
    user: {
      name: 'yogesh mishra',
      email: 'YOGESH@MISHRA.COM',
    },
    token: user.tokens[0].token,
  });
  expect(user.password).not.toBe('123456789');
});

//user login testing
test('Should login existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: createOne.email,
      password: createOne.password,
    })
    .expect(201);

  const user = await User.findById(response.body.user._id);
  expect(response.body.token).toBe(user.tokens[1].token);
});

//if user enter incorrect value
//user login testing
test('Should not login existing user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: createOne.email,
      password: 'yogiThisPass',
    })
    .expect(400);
});

//get profile for authenticated user
test('Should get profile for authenticated user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${createOne.tokens[0].token}`)
    .send()
    .expect(200);
});
// not get profile for unauthenticated user
test('Should not get profile for unauthenticated user', async () => {
  await request(app).get('/users/me').send().expect(403);
});

//delete profile for authenticated user
test('Should delete account for authenticated user', async () => {
  const response = await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${createOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(createObjectId);
  expect(user).toBeNull();
});

//should not delete profile for unauthenticated user
test('Should not delete account of unauthenticated user', async () => {
  await request(app).delete('/users/me').send().expect(403);
});

//testing for images
test('Should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${createOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/philly.jpg')
    //attach() provide by supertest for attach any file
    .expect(200);
  const user = await User.findById(createObjectId);
  expect(user.avatar).toEqual(expect.any(Buffer));
  /*when you want to compere object with expect() you can't use toBe it's work like ===
  so compere object jest provide toEqual\\\\//// expect.any use for checking file type */
});

//testing of user update
test('Should update valid user fields', async () => {
  const response = await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${createOne.tokens[0].token}`)
    .send({ name: 'mike' })
    .expect(200);
  const user = await User.findById(createObjectId);
  expect(user.name).toEqual('mike');
});

//testing of user update
test('Should not update invalid user fields', async () => {
  const response = await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${createOne.tokens[0].token}`)
    .send({
      location: 'raipur',
    })
    .expect(400);
});
