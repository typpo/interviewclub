var fs = require('fs');
var querystring = require('querystring');
var secrets = require('../secrets.js');
var https = require('https');
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
  trans.text = '{{company}} would like to pay you ${{price}} to conduct a technical interview!  Click to accept: http://gointerview.club/accept.html?id={{requestId}}.\r\n\r\nYou\'ll coordinate the interview times with the company.';
  trans.substitutionData = {
    company: req.query.company,
    price: req.query.price,
    requestId: req.query.requestId
  };

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

exports.accepted_interview = function(req, res) {
  // TODO accepted interview email to company
  var trans = {};

  // Set some metadata for your email
  trans.campaign = 'interview-mail';
  trans.from = 'interview_club_manager@gointerview.club';
  trans.subject = 'Someone wants to pay you to interview';

  // Add some content to your email
  //trans.html = '<html><body><h1>Congratulations, {{name}}!</h1><p>You just sent your very first mailing!</p></body></html>';
  trans.text = '{{company}} would like to pay you {{price}} to conduct a technical interview.  Click to accept: http://gointerview.club/accept.html?id={{requestId}}.  You\'ll coordinate the interview times with the company.';
  trans.substitutionData = {
    company: req.query.company,
    price: req.query.price,
    requestId: req.query.requestId
  };

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
}

exports.signup = function(req, res) {
  if (!req.query.email) {
    res.send('');
    return;
  }
  var trans = {};

  // Set some metadata for your email
  trans.campaign = 'interview-mail';
  trans.from = 'interview_club_signup@gointerview.club';
  trans.subject = 'Interview club signup';

  // Add some content to your email
  //trans.html = '<html><body><h1>Congratulations, {{name}}!</h1><p>You just sent your very first mailing!</p></body></html>';
  trans.text = '{{emailto}} - {{type}}';
  trans.substitutionData = {emailto: req.query.email, type: req.query.type};

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

var endpoint = 'api.fullcontact.com';
var apiKey = '&apiKey=2385a160a9dad8bd';
var mockCreepyData =
{
  "status" : 200,
  "requestId" : "9c14a9bd-8da2-4902-9eda-5ddcd434c140",
  "likelihood" : 0.91,
  "photos" : [ {
    "type" : "facebook",
    "typeId" : "facebook",
    "typeName" : "Facebook",
    "url" : "https://d2ojpxxtu63wzl.cloudfront.net/static/b2aea030f58284da39aba3bd6b9cec82_49d8e742a1435684d2a52d33b323510de98f2d4d349f69cf2bd3980cb2972c1e",
    "isPrimary" : true
  }, {
    "type" : "twitter",
    "typeId" : "twitter",
    "typeName" : "Twitter",
    "url" : "https://d2ojpxxtu63wzl.cloudfront.net/static/6663b9d2f951a2ccdf077050f4af8176_412284ce734b73b7f93f875aa2090b8658743a394cab27b7147079265a465cc0",
    "isPrimary" : false
  }, {
    "type" : "angellist",
    "typeId" : "angellist",
    "typeName" : "AngelList",
    "url" : "https://d2ojpxxtu63wzl.cloudfront.net/static/299fc33805278c3e2b26568b75c43cbb_8ba93165a2fe2fa6fd4e642db17a8c84eec54ec5f3724832500e35b13e811777",
    "isPrimary" : false
  }, {
    "type" : "linkedin",
    "typeId" : "linkedin",
    "typeName" : "LinkedIn",
    "url" : "https://d2ojpxxtu63wzl.cloudfront.net/static/08228fd1e164316e04fc3a9685293b3d_76c56abff7516c6d038e8039b6558f35b372189ece4666d4fbe2d41b46a78ff8",
    "isPrimary" : false
  }, {
    "type" : "gravatar",
    "typeId" : "gravatar",
    "typeName" : "Gravatar",
    "url" : "https://d2ojpxxtu63wzl.cloudfront.net/static/936323b292295cd87712512d4d90adab_79f084ad48cdc1f6ac3b17e89258742953c7e84792ca70cc036278d7a3db5259",
    "isPrimary" : false,
    "photoBytesMD5" : "a1719586837f0fdac8835f74cf4ef04a"
  } ],
  "contactInfo" : {
    "familyName" : "Singh",
    "fullName" : "Hemant Singh",
    "givenName" : "Hemant"
  },
  "organizations" : [ {
    "isPrimary" : true,
    "name" : "Birla Institute of Technology and Science Pilani",
    "title" : "Student",
    "current" : true
  } ],
  "demographics" : {
    "locationDeduced" : {
      "normalizedLocation" : "India",
      "deducedLocation" : "India",
      "country" : {
        "deduced" : false,
        "name" : "India",
        "code" : "IN"
      },
      "continent" : {
        "deduced" : true,
        "name" : "Asia"
      },
      "likelihood" : 1.0
    },
    "gender" : "Male",
    "locationGeneral" : "Chirawa Area, India"
  },
  "socialProfiles" : [ {
    "type" : "klout",
    "typeId" : "klout",
    "typeName" : "Klout",
    "url" : "http://klout.com/netham91",
    "username" : "netham91",
    "id" : "9288686129214007"
  }, {
    "bio" : "A neophile. INTP. An addict of cognitive ecstasy. A pattern junkie.",
    "followers" : 168,
    "following" : 200,
    "type" : "twitter",
    "typeId" : "twitter",
    "typeName" : "Twitter",
    "url" : "https://twitter.com/netham91",
    "username" : "netham91",
    "id" : "988581061"
  }, {
    "type" : "facebook",
    "typeId" : "facebook",
    "typeName" : "Facebook",
    "url" : "https://www.facebook.com/netham91",
    "username" : "netham91",
    "id" : "100001449795492"
  }, {
    "bio" : "Coordinator @preseed  Web Lab\nFirst Employee @yourbus",
    "type" : "angellist",
    "typeId" : "angellist",
    "typeName" : "AngelList",
    "url" : "https://angel.co/netham91",
    "username" : "netham91",
    "id" : "761298"
  }, {
    "bio" : "Google Summer of Code, 2014",
    "type" : "linkedin",
    "typeId" : "linkedin",
    "typeName" : "LinkedIn",
    "url" : "https://www.linkedin.com/pub/hemant-singh/3a/631/461",
    "id" : "hemant-singh/3a/631/461"
  }, {
    "type" : "gravatar",
    "typeId" : "gravatar",
    "typeName" : "Gravatar",
    "url" : "https://gravatar.com/netham91",
    "username" : "netham91",
    "id" : "28630109"
  } ],
  "digitalFootprint" : {
    "scores" : [ {
      "provider" : "klout",
      "type" : "general",
      "value" : 24
    } ],
    "topics" : [ {
      "provider" : "klout",
      "value" : "Software"
    }, {
      "provider" : "klout",
      "value" : "Richard Branson"
    }, {
      "provider" : "klout",
      "value" : "EMC"
    }, {
      "provider" : "klout",
      "value" : "Forrester"
    }, {
      "provider" : "klout",
      "value" : "Forrester Research"
    } ]
  }
};
exports.creepyInfo = function(req, res) {
  if (!req.query.email) {
    res.send('');
    return;
  } else {
    res.send(mockCreepyData);
    return;
  }
  var path = '/v2/person.json?email=' + req.query.email + apiKey;
  var options = {
    host: endpoint,
    path: path,
    port: 443,
    method: 'POST'
  };

  console.log(options);
  var request = https.request(options, function(response) {
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
      res.send(chunk);
    });
  });
  request.end();
  request.on('error', function(e) {
    console.log(e);
  });
};

function handle(req, res) {
  res.render('index', {});
}
