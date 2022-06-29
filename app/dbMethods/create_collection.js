

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://mboston:Niaiaj421who42%211@cluster0.rfvqy.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object

  myobj = { test: '123' }
  collection.insertOne(myobj, function (err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    client.close();
  });

});