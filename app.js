var express = require('express');
var app = express();


app.use(express.static('public'));

app.get('/frame', function (req, res) {
  //res.send('Hello World!');
  res.sendFile(__dirname + "/" + "frame.html"  );
});

app.get('/demo', function (req, res) {
  //res.send('Hello World!');
  res.sendFile(__dirname + "/" + "demo.html"  );
});

app.get('/', function (req, res) {
  //res.send('Hello World!');
  res.sendFile(__dirname + "/" + "demo.html"  );
});

app.listen(process.env.PORT || 3000, function () {
  if( !process.env.PORT ) {console.log('Example app listening on port 3000!');}
});
