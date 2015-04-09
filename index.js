var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 5000));
var compress = require('compression');
app.use(compress());
app.use(express.static(__dirname + '/public'));
setInterval(function () {
    http.get("http://www.teamkart.in/");
    console.log('ping')
}, 900000);
app.listen(app.get('port'), function () {
  console.log("Node app is running at localhost:" + app.get('port'));
});
