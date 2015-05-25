var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var favicon = require('serve-favicon');
var compression = require('compression');
var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(favicon(__dirname + '/public/images/favicon.ico'));
transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'teamkartiitkharagpur@gmail.com',
        pass: '@teamkart%'
    }
});
mailList = ['nidhin.m3gtr@gmail.com', 'teamkartiitkharagpur@gmail.com'];
app.post('/message/', function (req, res) {
    name = req.body.name;
    email = req.body.email;
    message = req.body.message;
    for (i = 0; mailList[i]; i++) {
        message =
            {
                from: 'mailclient@teamkart.in',
                subject: 'New message at teamkart.in from ' + req.body.name,
                text: 'Email: ' + req.body.email + '\n' + req.body.name + ' says: "' + req.body.message + '"'
            };
        message.to = mailList[i];
        transporter.sendMail(message);
    }
    res.send(null);
});
app.use(express.static(__dirname + '/public'));
setInterval(function () {
    http.get("http://www.teamkart.in/");
}, 900000);
app.listen(app.get('port'));
