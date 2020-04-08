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

    //update field at collection
    // db.collection("users")
    //   .updateOne(
    //     { _id: new ObjectID("5e8cc47491cfae08181fcc39") },
    //     {
    //       $set: {
    //         name: "dev",
    //       },
    //     }
    //   )
    //   .then((result) => {
    //     console.log(result);
    //   })
    //   .catch((err) => {
    //     console.log(error);
    //   });

    // db.collection("tasks")
    //   .updateMany(
    //     { completed: false },
    //     {
    //       $set: {
    //         completed: true,
    //       },
    //     }
    //   )
    //   .then((result) => {
    //     console.log(`tasks completed ${result}`);
    //   })
    //   .catch((err) => {
    //     console.log(`something went to wrong ${error}`);
    //   });
    db.collection("users")
      .deleteOne({
        _id: new ObjectID("5e8cc9383514482bc079caa2"),
      })
      .then((result) => {
        console.log(result.result);
      })
      .catch((err) => {
        console.log(error);
      });
  }
);
