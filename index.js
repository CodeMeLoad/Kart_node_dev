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
var favicon = require( 'serve-favicon' );
var crypto = require( 'crypto' );
var compression = require('compression');
var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use( favicon( __dirname + '/public/images/favicon.ico' ) );
var SECRET = '6Le5ZAcTAAAAAFuILlE2DZ7CCiPJqn67Q5R5NVUD';
function verifyRecaptcha( key, callback )
{
    https.get( "https://www.google.com/recaptcha/api/siteverify?secret=" + SECRET + "&response=" + key, function ( res )
    {
        var data = "";
        res.on( 'data', function ( chunk )
        {
            data += chunk.toString();
        } );
        res.on( 'end', function ()
        {
            try
            {
                var parsedData = JSON.parse( data );
                callback( parsedData.success );
            }
            catch ( e )
            {
                callback( false );
            }
        } );
    } );
}
function createTransport()
{
    transporter = nodemailer.createTransport( {
        service: 'gmail',
        auth: {
            user: 'teamkartiitkharagpur@gmail.com',
            pass: '@teamkart%'
        }
    } );
    return transporter;
}
function encrypt( text, key )
{
    var cipher = crypto.createCipher( 'aes-256-cbc', key )
    var crypted = cipher.update( text, 'utf8', 'hex' )
    crypted += cipher.final( 'hex' );
    return crypted;
}
function decrypt( text, key )
{
    var decipher = crypto.createDecipher( 'aes-256-cbc', key )
    var dec = decipher.update( text, 'hex', 'utf8' )
    dec += decipher.final( 'utf8' );
    return dec;
}
app.post( '/message/', function ( req, res )
{
    if ( req.body['a'] != undefined && req.body['b'] != undefined )
    {
        a = decrypt( req.body.a, "34ed5rf6t7y8" );
        b = decrypt( req.body.b, "pqo30v763459r0" );
        if ( a != b )
        {
            res.send( '0' );
            return;
        }
        email = a;
        transporter = createTransport();
        mailList = ['nidhin.m3gtr@gmail.com'];
        reply = require( './htmlMail.min.html' );
        messageReply = {
            subject: 'Successfully subscribed to TeamKART',
            to: email,
            from: 'TeamKART <teamkartiitkharagpur@gmail.com>',
            html: reply
        };
        transporter.sendMail( messageReply );
        for ( i = 0; mailList[i]; i++ )
        {
            message = {
                subject: 'New blog subscriber at teamkart.in',
                text: email + ' wants to follow TeamKART. Add this entry to the mailing list.'
            };
            message.to = mailList[i];
            transporter.sendMail( message );
        }
        res.send( '0' );
        return;
    }
    else if ( req.body['feedback'] != undefined )
    {
        email = req.body.email + " doesn't want to recieve mails anymore. Remove this entry from the mailing list.";
        if ( req.body.feedback != "" )
            email = email + "\nHe/She left a message:\n" + req.body.feedback;
        transporter = createTransport();
        mailList = ['nidhin.m3gtr@gmail.com'];
        for ( i = 0; mailList[i]; i++ )
        {
            message = {
                subject: 'Bad news',
                text: email
            };
            message.to = mailList[i];
            transporter.sendMail(message);
        }
        res.send( '0' );
        return;
    }
    else if(req.body['captcha'] != undefined )
    {
        verifyRecaptcha( req.body.captcha, function ( success )
        {
            if ( !success )
                res.send( '1' );
            else
            {
                email = req.body.email;
                transporter = createTransport();
                mailList = ['nidhin.m3gtr@gmail.com'];
                if ( req.body.name != undefined )
                {
                    name = req.body.name;
                    phone = req.body.phone;
                    message = req.body.message;
                    body = name + ' says: \n\n\t"' + message + '"';
                    if ( email != "" || phone != "" )
                        body = body + '\n\nContact Info:\n';
                    if ( email != "" )
                        body = body + 'Email: ' + email;
                    if ( phone != "" )
                        body = body + '\nPhone: ' + phone;
                    for ( i = 0; mailList[i]; i++ )
                    {
                        messageSend = {
                            subject: 'New message at teamkart.in from ' + name,
                            text: body
                        };
                        messageSend.to = mailList[i];
                        transporter.sendMail( messageSend );
                    }
                }
                else
                {
                    reply = require( './verifyMail.min.html' );
                    a = encrypt( email, "34ed5rf6t7y8" );
                    b = encrypt( email, "pqo30v763459r0" );
                    r = 'http://www.teamkart.in/confirm/index.html?a=' + a + '&b=' + b;
                    c = reply.indexOf( 'ADD23' );
                    reply = reply.slice( 0, c ) + r + reply.slice( c + 4, reply.length );
                    messageReply =
                        {
                            subject: 'Confirm TeamKART subscription',
                            to: email,
                            from: 'TeamKART <teamkartiitkharagpur@gmail.com>',
                            html: reply
                        };
                    transporter.sendMail( messageReply );
                }
                res.send( '0' );
            }
        } );
    }
});
app.use(express.static(__dirname + '/public'));
app.listen( app.get( 'port' ) );
