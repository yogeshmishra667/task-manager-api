// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;
const { MongoClient, ObjectID } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

// const id = new ObjectID();
// console.log(id.id); //id return raw binary data
// //console.log(id.id.length);
// console.log(id.getTimestamp());
// console.log(id.toHexString());

MongoClient.connect(
  connectionURL,
  { useUnifiedTopology: true },
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log(`something went to wrong ${error}`);
    }
    const db = client.db(databaseName); //use for access specific database

    /* **************read and find data at collections************** */

    // db.collection("users").findOne({ name: "yogi" }, (error, result) => {
    //   if (error) {
    //     return console.log("unable to users");
    //   }
    //   console.log(result);
    // });

    // db.collection("users").find({ name: "yogi" }).toArray((error, documents) => {
    //     if (error) {
    //       return console.log("unable to fetch users");
    //     }
    //     console.log(documents);
    //   });

    //challenge
    // db.collection("tasks").findOne(
    //   new ObjectID("5e8cc9383514482bc079caa4"),
    //   (error, desp) => {
    //     if (error) {
    //       return console.log("unable to fetch users");
    //     }
    //     console.log(desp);
    //   }
    // );

    db.collection("tasks")
      .find({ completed: true })
      .toArray((error, documents) => {
        if (error) {
          return console.log("unable to find records");
        }
        console.log(documents);
      });

    /* ****************** *insert data in collection***************** */

    // db.collection('users').insertOne({
    //   name:'yogi',
    //   age:20
    // },(error, result) => {
    // if (error) {
    //   return console.log('data not inserted')
    // }
    // console.log(result.ops)

    // db.collection("users").insertMany(
    //   [
    //     {
    //       name: "yogesh mishra",
    //       age: 21,
    //     },
    //     {
    //       name: "mongodb",
    //       age: 11,
    //     },
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       return console.log("users not inserted");
    //     }
    //     console.log(result.ops);
    //   }
    // );
    // db.collection("tasks").insertMany(
    //   [
    //     {
    //       description: "love with mongodb",
    //       completed: false,
    //     },
    //     {
    //       description: "read think and grow rich",
    //       completed: true,
    //     },
    //     {
    //       description: "start mongodb",
    //       completed: true,
    //     },
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       return console.log("unable to inserted data");
    //     }
    //     console.log(result.ops);
    //   }
    // );
  }
);
