var fs = require('fs');
var querystring = require('querystring');
var secrets = require('../secrets.js');
var sparkpost = require('sparkpost')({key: secrets.key});

exports.home = function(req, res) {
  handle(req, res);
}

exports.main = function(req, res) {
  handle(req, res);
};

exports.request_interview = function(req, res) {
  var trans = {};

  // Set some metadata for your email
  trans.campaign = 'interview-mail';
  trans.from = 'interview_club_manager@gointerview.club';
  trans.subject = 'Someone wants to pay you to interview';

  // Add some content to your email
  //trans.html = '<html><body><h1>Congratulations, {{name}}!</h1><p>You just sent your very first mailing!</p></body></html>';
  trans.text = '{{company}} would like to pay you $xx for an hour of your time.  Accept?';
  trans.substitutionData = {company: req.query.company};

  // Pick someone to receive your email
  trans.recipients = [{ address: { name: 'gointerview.club', email: querystring.unescape(req.query.email) } }];

  // Send it off into the world!
  sparkpost.transmission.send(trans, function(err, res) {
    if (err) {
      console.log('Whoops! Something went wrong');
      console.log(err);
    } else {
      console.log('Woohoo! You just sent your first mailing!');
    }
  });

  res.send('ok');
};

exports.signup = function(req, res) {
  if (!req.query.email) {
    res.send('');
  }
  var trans = {};

  // Set some metadata for your email
  trans.campaign = 'interview-mail';
  trans.from = 'interview_club_signup@gointerview.club';
  trans.subject = 'Interview club signup';

  // Add some content to your email
  //trans.html = '<html><body><h1>Congratulations, {{name}}!</h1><p>You just sent your very first mailing!</p></body></html>';
  trans.text = '{{email}} - {{type}}';
  trans.substitutionData = {email: req.query.email, type: req.query.type};

  // Pick someone to receive your email
  trans.recipients = [{ address: { name: 'gointerview.club', email: 'ianw_interviewclubsignup@ianww.com' } }];

  // Send it off into the world!
  sparkpost.transmission.send(trans, function(err, res) {
    if (err) {
      console.log('Whoops! Something went wrong');
      console.log(err);
    } else {
      console.log('Woohoo! You just sent your first mailing!');
    }
  });

  res.send('ok');

  fs.appendFile('emails.txt', req.query.email + '-' + req.query.type + '\n', function(err) {

  });
};

function handle(req, res) {
  res.render('index', {});
}
