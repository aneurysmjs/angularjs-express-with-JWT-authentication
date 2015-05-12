var express = require('express'),
    faker = require('faker'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    jwt = require('jsonwebtoken');

/*
* JSON web token is an specification for authentication.
* so a jwt is an encoded JSON object that the server encodes using
* a secret key. The encoded JSON object is called a token.
* That token is sent to the client when the client authenticates.
* Then the client sends that token back on every single request.
* The server, at that point, will decode that token using the same private key,
* so that it can identify who the user is and act accordingly.
*
* What we're going to do is set up the encoding of that token.
*
* For simplicity's sake, we're going to create a JWT secret and
* we'll just make it a bunch of random characters.
* Normally, you would want this to be stored in an environment variable
* or some other secure place, but we'll just leave it as a string in our app.
*/

var jwtSecret = 'dflnasdñlksdnñfoasdfa';

var app = express();

app.use(cors());

//app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
   extended: true
}));

var user = {
   username: 'jero',
   password: 'p'
};


app.get('/random-user', function(req, res){
   var user = faker.helpers.userCard();
   user.avatar = faker.image.avatar();
   res.json(user);
});


app.post('/login',authenticate, function(req, res) {
   /*
   * Now, we want to encode the user object when the user authenticates.
   * instead of sending the user('res.send(user)'), we're going to want to send a token.
   * We'll create that token now.
   * Token is a JWT.sign and the payload is what is going to be the encoded object.
   * We'll just encode the username for now, but there is an entire specification
   * on what you should actually include in this that you can read up on.
   * For our purposes, the username is sufficient.
   */

   var token = jwt.sign({
      //the payload is what is going to be the encoded object.
      username: user.username
   }, jwtSecret);

   res.send({
      token: token,
      user: user
   });
});

// util functions
function authenticate(req, res, next) {
   var body = req.body;
   if(!body.username || !body.password){
      res.status(400).end('Must provide username and password');
   }else if(body.username !== user.username || body.password !== user.password){
      res.status(401).end('username or password incorrect');
   }
   next();
}

app.listen(1989, function () {
   console.log('app listening on localhost:1989');
});

