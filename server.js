var express = require('express'),
    faker = require('faker'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    jwt = require('jsonwebtoken')
    expressJwt = require('express-jwt');

var jwtSecret = 'dflnasdñlksdnñfoasdfa';

var app = express();

app.use(cors());

//app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
   extended: true
}));

/*
* This will take a 'secret', and we'll use the same 'jwtSecret'.
* Because this is going to be verifying our tokens, we need to verify it with the same secret.
* However, when a user is logging in, they obviously won't have a token, and so we need to add unless(),
* on this middleware, and we'll say the path is in this array ['/login'].
* Now express-jwt, under the covers, is going to intercept all of the requests that come in.
*
* It will take this authorization header, with the bearer and the token, it will decode that token using the jot secret.
* If it does decode properly and the signature is verified, then it'll add 'user' to the request object
* and the user property will simply be the decoded json object.
*/
app.use(expressJwt({ secret: jwtSecret }).unless({ path: ['/login']}));
var user = {
   username: 'jero',
   password: 'p'
};

app.get('/random-user', function(req, res){
   var user = faker.helpers.userCard();
   user.avatar = faker.image.avatar();
   res.json(user);
});

app.post('/login', authenticate, function(req, res) {
   var token = jwt.sign({
      username: user.username
   }, jwtSecret);

   res.send({
      token: token,
      user: user
   });
});

app.get('/me', function(req, res){
   res.send(req.user);
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

