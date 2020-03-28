var express = require('express');
var app = express();
var path = require('path');

//get heroku port or use localhost
var port = process.env.PORT || 8080;


//public stuff
app.use(express.static(path.join(__dirname, "public")));


//read main html
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

//start server

app.listen(port);