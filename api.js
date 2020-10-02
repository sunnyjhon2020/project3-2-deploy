var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
const cors = require('cors')
const {
  pool
} = require('./connect')

// for parsing application/json
app.use(bodyParser.json());
app.use(cors())

// for parsing application/xwww-
app.use(bodyParser.urlencoded({
  extended: true
}));
//form-urlencoded

app.use('/', express.static(__dirname + '/recipe'));
app.use('*', express.static(__dirname + '/recipe'));

app.get('/*', function (req, res) {
  res.send('/index.html')
})

app.post('/api/register', function (req, res) {
  let reqBody = req.body;
  let sqlQuery = `INSERT INTO USERS (name, email, password) VALUES ('${reqBody.name}', '${reqBody.email}','${reqBody.password}')`;
  pool.query(sqlQuery, (error, results) => {
    if (error && error.constraint == 'users_email_key') {
      console.log(error);
      res.status(400).send({message: 'account with this email already, please login', code: 400 });
    } else {
      res.status(200).send({message: 'user registered successfully', code: 200});
    }
  })
});

app.post('/api/login', function (req, res) {
  let reqBody = req.body;
  let sqlQuery = `SELECT password from users where email = '${reqBody.email}'`;
  pool.query(sqlQuery, (error, results) => {
    if (results.rows[0].password && reqBody.password == results.rows[0].password) {
      res.status(200).send({message: 'User logged in successfully', code: 200});
    } else {
      res.status(401).send({message: 'An error has occurred, please try again with correct details', code: 401});
    }
  })
});

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)
})