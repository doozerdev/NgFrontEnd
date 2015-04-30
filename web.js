var express = require('express');
var app = express();

app.use(express.static('dist'));

// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });

var server = app.listen(process.env.PORT || 9000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});