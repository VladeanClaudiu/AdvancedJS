console.log('Server-side code running');

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyparser = require('body-parser');
const app = express();


//let score = 0;
// serve files from the public directory
app.use(express.static('public'));
app.use(bodyparser.json());
// connect to the db and start the express server
let db;

// ***Replace the URL below with the URL for your database***
const url =  'mongodb://localhost:27017/scores';

MongoClient.connect(url, (err, database) => {
  if(err) {
    return console.log(err);
  }
  db = database;
  // start the express web server listening on 8080
  app.listen(8080, () => {
    console.log('listening on 8080');
  });
});

// serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
// add a document to the DB collection recording the click event
app.post('/score', (req, res) => {
  const score = {score: req.body.score};
  console.log(db);

  db.collection('scores').save(score, (err, result) => {
    if (err) {
      return console.log(err);
    }
    console.log('Score added to db');
    res.redirect('/');
  });
});


// get the click data from the database
app.get('/scores', (req, res) => {
  db.collection('scores').findOne({},(err, result) => {
    if (err) return console.log(err);
    if(!result) return res.send({score:0});
    res.send(result);
  });
});

