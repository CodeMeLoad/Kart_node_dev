var express = require('express');
var http = require('http');
var https = require( 'https' );
var path = require( 'path' );
var fs = require( 'fs' );
require.extensions['.html'] = function ( module, filename )
{
    module.exports = fs.readFileSync( filename, 'utf8' );
};
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
app.post('/message/', function (req, res) {
    verifyRecaptcha(req.body["captcha"], function (success)
    {
        if (!success) 
            res.send('1');
        else
        {
            transporter = nodemailer.createTransport(
                {
                    service: 'gmail',
                    auth:
                        {
                            user: 'teamkartiitkharagpur@gmail.com',
                            pass: '@teamkart%'
                        }
                });
            mailList = ['nidhin.m3gtr@gmail.com'];
            email = req.body.email;
            if (req.body.name != undefined)
            {
                name = req.body.name;
                phone = req.body.phone;
                message = req.body.message;
                for (i = 0; mailList[i]; i++)
                {
                    message =
                        {
                            subject: 'New message at teamkart.in from ' + name,
                            text: name + ' says: \n\n\t"' + message + '"\n\nContact Info:\nEmail: ' + email + '\nPhone: ' + phone
                        };
                    message.to = mailList[i];
                    transporter.sendMail(message);
                }
            }
            else
            {
               // reply = require( 'htmlMain.min.html' );
                /*messageReply =
                    {
                        subject: 'Successfully subscribed to TeamKART',
                        to: email,
                        html: reply
                    };*/
                //transporter.sendMail( messageReply );
                for ( i = 0; mailList[i]; i++ )
                {
                    message =
                        {
                            subject: 'New blog subscriber at teamkart.in',
                            text: email + ' wants to follow TeamKART. Add this entry to the mailing list.'
                        };
                    message.to = mailList[i];
                    transporter.sendMail(message);
                }
            }
            res.send('0');
        }
    });
});
app.use(express.static(__dirname + '/public'));
app.listen(app.get('port'));
var SECRET='6Le5ZAcTAAAAAFuILlE2DZ7CCiPJqn67Q5R5NVUD';
function verifyRecaptcha(key, callback) {
    https.get("https://www.google.com/recaptcha/api/siteverify?secret=" + SECRET + "&response=" + key, function (res) {
        var data = "";
        res.on('data', function (chunk) {
            data += chunk.toString();
        });
        res.on('end', function ()
        {
            try
            {
                var parsedData = JSON.parse(data);
                callback(parsedData.success);
            }
            catch (e)
            {
                callback(false);
            }
        });
    });
}