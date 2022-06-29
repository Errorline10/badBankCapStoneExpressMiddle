
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://mboston:Niaiaj421who42%211@cluster0.rfvqy.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {




// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://docker:mongopw@localhost:49153";

client.connect(err => function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.createCollection("customers", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
});
