var express = require('express'),
    faker = require('faker'),
    cors = require('cors'),
    bodyParser = require('body-parser');

var app = express();

app.use(cors());

//app.use(express.static(__dirname + '/public'));

/*
* we need to eb able to read the JSON that it comes back with the request
* especially the 'username' and 'password', to do that we need bodyParse
* which lets express the ability to parse the body that comes in
*
*/
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
   extended: true
}));

/*
* now we need to have username and password to check against, normally
* is stored in a database, but in our case we going to create a 'mini' database
* just to make thing simple
*/
var user = {
   user: 'jero',
   password: 'p'
};

// util functions
function authenticate(req, res, next) {
   var body = req.body;
   if(!body.username || !body.password){
      res.status(400).end('Must provide username and password');
   }
   if(body.username !== user.username || body.password !== user.password){
      res.status(401).end('username or password incorrect');
   }
   next();
}

app.get('/random-user', function(req, res){
   var user = faker.helpers.userCard();
   user.avatar = faker.image.avatar();
   res.json(user);
});

app.post('/login', authenticate, function (req, res) {
   //if the user is authenticated,we just send the user back
   res.send(user);
});

app.listen(1989, function () {
   console.log('app listening on localhost:1989');
});

