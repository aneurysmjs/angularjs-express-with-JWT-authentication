var express = require('express'),
    faker = require('faker'),
    cors = require('cors');

var app = express();

app.use(cors());

app.get('/random-user', function(req, res){
   var user = faker.helpers.userCard();
   user.avatar = faker.image.avatar();
   res.json(user);
});

app.listen(1989, function () {
   console.log('app listening on localhost:1989');
});