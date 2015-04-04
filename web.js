//var gzippo = require('gzippo');
var express = require('express');
var app = express();
 
//app.use(express.logger('dev'));
app.use("" + __dirname + "/dist");
app.get('/', function(req, res) {
    res.sendfile('index.html', {root: __dirname })
});

app.listen(process.env.PORT || 80);