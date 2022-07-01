'use strict';

// create an express app
const express = require("express")
var cors = require('cors')
const app = express()
app.use(cors())
app.options('*', cors()) // include before other routes

//app.use(bodyParser.urlencoded({ extended: true }));

//CORS middleware
// var allowCrossDomain = function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');

//   next();
// }


// app.configure(function() {
//   app.use(express.bodyParser());
//   app.use(express.cookieParser());
//   app.use(express.session({ secret: 'cool beans' }));
//   app.use(express.methodOverride());
//   app.use(allowCrossDomain);
//   app.use(app.router);
//   app.use(express.static(__dirname + '/public'));
// });

// use the express-static middleware
app.use(express.static("public"))

// App
app.get('/', (req, res,) => {
  res.send('Hello World');

});



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://mboston:Niaiaj421who42%211@cluster0.rfvqy.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




//                                 ________________
// _______________________________/ list all users \_____
// This section will help you get a list of all the documents.
app.get("/listallusers", async function (req, res) {
  client.connect(err => {
    if (err) {
      res.status(400).send("Error creating document!");
      return console.log(err)
    }
    else {
      const collection = client.db("UserTable").collection("UserTableCollection");
      collection.find({}).limit(50).toArray(function (err, result) {
        if (err) {
          res.status(400).send("Error fetching listings!");
        } else {
          res.json(result);
        }

      })
    }
  })
})




//                                 ________
// _______________________________/ Log In \_____
// This section will help you get a list of all the documents.
app.get("/login/:email/:password", async function (req, res) {
  client.connect(err => {
    if (err) {
      res.status(400).send("Error creating document!");
      return console.log(err)
    }
    else {
      const collection = client.db("UserTable").collection("UserTableCollection");
      collection.find({ email: req.params.email }).limit(1).toArray(function (err, result) {
        if (err) {
          res.status(400).send("Error fetching listings!");
        } else {
          if (req.params.password === result[0].password) {
            console.log(result)
            return res.json(result);
          }
          return res.json({ err: 'invalid UserName or password' });
        }

      })
    }
  })
})



//                                 __________________
// _______________________________/ Create New users \_______
// this add a new user to the "UserTable.UserTableCollection"
app.get('/createUser/:name/:email/:password', (req, res) => {
  res.send(req.params)
  console.log(req.params)

  client.connect(err => {
    if (err) {
      res.status(400).send("Error creating document!");
      return console.log(err)
    } else {

      // register a new user and give them 100 in a savings account
      let myobj = { name: req.params.name, email: req.params.email, password: req.params.password, bankAccounts: [{ name: 'savings', email: req.params.email, transactions: [{ deposit: 100 }] }] };

      const collection = client.db("UserTable").collection("UserTableCollection");
      collection.insertOne(myobj, function (err, res) {
        if (err) throw err;
        client.close();
        return console.log("Created new User: ", myobj);
      });
    }

  })
})



//                                 ____________________
// _______________________________/ make a transaction \_______
// 'withdraw' or 'deposit' to the "UserTable.UserTableCollection"
// todo: add token
app.get('/transaction/:type/:email/:password/:acc/:amount', (req, res) => {
  if (req.params.type === 'deposit' || req.params.type === 'withdraw') {

    client.connect(err => {
      if (err) { res.status(400).send("Error creating document!"); }
      else {
        const collection = client.db("UserTable").collection("UserTableCollection");

        // get current document
        collection.find({ email: req.params.email }).limit(1).toArray(
          function (err, result) {
            if (err) { res.status(400).send("Error fetching listings!") }
            else {
              if (!result[0]) {
                return res.json({ err: 'user/pass not correct' });
              }

              if (req.params.password !== result[0].password) {
                return res.json({ err: 'user/pass not correct' });
              } else {

                // update the record 
                let newDoc = result[0];
                let accountFound = false;
                for (let x in newDoc.bankAccounts) {
                  if (newDoc.bankAccounts[x].name === req.params.acc) {
                    accountFound = true;

                    if (req.params.type === 'deposit') {
                      newDoc.bankAccounts[x].transactions.push({ deposit: req.params.amount })
                    }

                    if (req.params.type === 'withdraw') {
                      newDoc.bankAccounts[x].transactions.push({ withdraw: req.params.amount })
                    }

                  }
                }

                if (accountFound) {
                  // todo: replace the document to update it
                  collection.replaceOne(
                    { email: req.params.email },
                    newDoc
                  )
                  return res.send(newDoc)
                }
                else { return res.json({ err: 'account not found' }); }
              }
            }
          })
      }
    })
  } else {  // an inncorrect transaction type in the url
    return res.json({ err: 'transaction type is not supported' });
  }
})



//                                 ________________
// _______________________________/ add an Account \_______
// adds an account to the users bankAccounts record 
// (Ie. saving or checking)
// todo: add token
app.get('/addaccount/:email/:password/:acc', (req, res) => {
  client.connect(err => {
    if (err) { res.status(400).send("Error creating document!"); }
    else {
      const collection = client.db("UserTable").collection("UserTableCollection");

      // get current document
      collection.find({ email: req.params.email }).limit(1).toArray(
        function (err, result) {
          if (err) { res.status(400).send("Error fetching listings!") }
          else {
            if (!result[0]) {
              return res.json({ err: 'user/pass not correct' });
            }

            if (req.params.password !== result[0].password) {
              return res.json({ err: 'user/pass not correct' });
            } else {

              // update the record 
              let newDoc = result[0];
              newDoc.bankAccounts.push({ name: req.params.acc, transactions: [] })

              console.log(newDoc)
              // add the account to the DB
              collection.replaceOne({ email: req.params.email }, newDoc)
              return res.send(newDoc)
            }
          }
        })
    }
  })
})




// start the server listening for requests
app.listen(process.env.PORT || 3000,
  () => console.log("Server is running..."));


console.log('Express server is running: ', process.env.PORT);