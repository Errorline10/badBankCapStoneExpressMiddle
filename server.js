'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = 'localhost';

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello World');
});

// create a collection
app.get('/create', (req, res) => {

  res.send('/creating, and writing 1 doc to mongo ');
  console.log(req)
  const { MongoClient, ServerApiVersion } = require('mongodb');
  const uri = "mongodb+srv://mboston:Niaiaj421who42%211@cluster0.rfvqy.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

  // find in req: userId, userName, email, password
  console.log('connecting...')
  client.connect(err => {
    if (err) { return console.log(err) }
    const collection = client.db("UserTable").collection("UserTableCollection");
    // perform actions on the collection object

    let myobj = { userId: '555', email: 'mboston30@gmail.com', password: 'password' }
    collection.insertOne(myobj, function (err, res) {
      if (err) throw err;
      return console.log("1 document inserted: ", myobj);
      client.close();
    });

  });


});


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);