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
var crypto = require( 'crypto' );
var compression = require('compression');
var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(compression());
app.use(bodyParser.json());
app.use( bodyParser.urlencoded( { extended: false } ) );
var SECRET = ( process.env.RECAPTCHA || require( './recaptchasecret.html' ) );
var PASSWORD = ( process.env.PASSWORD || require( './password.html' ) );
var KEYS = [];
KEYS[0] = ( process.env.ENC0 || '34ed5rf6t7y8' );
KEYS[1] = ( process.env.ENC1 || 'pqo30v763459r0' );
var mailList = ['nidhin.m3gtr@gmail.com'];
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
            pass: PASSWORD
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
    var decipher = crypto.createDecipher( 'aes-256-cbc', key );
    try
    {
        var dec = decipher.update( text, 'hex', 'utf8' )
        dec += decipher.final( 'utf8' );
        return dec;
    } catch ( e )
    {
        console.log( 'fail' );
        return;
    }
}
app.post( '/message/', function ( req, res )
{
    if ( req.body['a'] != undefined && req.body['b'] != undefined )
    {
        a = decrypt( req.body.a, KEYS[0] );
        b = decrypt( req.body.b, KEYS[1] );
        if ( a != b )
        {
            res.send( '0' );
            return;
        }
        email = a;
        transporter = createTransport();
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
                    a = encrypt( email, KEYS[0] );
                    b = encrypt( email, KEYS[1] );
                    r = 'http://www.teamkart.in/confirm.html?a=' + a + '&b=' + b;
                    c = reply.indexOf( 'ADD23' );
                    reply = reply.slice( 0, c ) + r + reply.slice( c + 5, reply.length );
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
app.use( express.static( __dirname + '/public' ) );
app.get( '*', function ( req, res )
{
    page404 = require( './404.html' );
    res.status( 404 ).send( page404 );
} );
app.listen( app.get( 'port' ) );
