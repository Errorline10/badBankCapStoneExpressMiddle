'use strict';

// create an express app
const express = require("express")
var cors = require('cors')
const app = express()
app.use(cors())
app.options('*', cors()) // include before other routes


// use the express-static middleware
app.use(express.static("public"))

// App
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

    let myobj = { userId: '555', email: 'mboston30@gmail.com', password: 'passwordfromExpress' }
    collection.insertOne(myobj, function (err, res) {
      if (err) throw err;
      return console.log("1 document inserted: ", myobj);
      client.close();
    });

  });


});

// start the server listening for requests
app.listen(process.env.PORT || 3000, 
	() => console.log("Server is running..."));


console.log('Express server is running: ', process.env.PORT);