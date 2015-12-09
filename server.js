var PORT = process.env.PORT ? process.env.PORT : 8008;

var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function(req, res, next){
    res.render('index')
});

app.listen(PORT);
console.log('Server listening on port ' + PORT);
