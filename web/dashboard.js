'use strict';

var STATE_FLOW = {
  "REQUESTED": {
    name: 'Requested',
    className: 'requested',
    actions: [{
      button: "Accept",
      nextState: "ACCEPTED"
    }, {
      button: "Decline",
      nextState: "REJECTED"
    }]
  },
  "REJECTED": {
    name: 'Rejected',
    className: 'rejected',
    actions: []
  },
  "ACCEPTED": {
    name: 'Accepted',
    className: 'accepted',
    actions: [{
      button: "Enter candidate feedback",
      nextState: "COMPLETED"
    }]
  },
  "COMPLETED": {
    name: 'Complete',
    className: 'completed',
    actions: []
  }
};


Parse.$ = jQuery;
Parse.initialize("WYKBPP1wtAdbqiTfjKvkrWhEObFvll67wivhst20", "O1AvRyOcTE1aUV9LvdiJ95Acg9EGyWIgpNf9WNCy");

var currentCompany = Parse.User.current();
var userQuery = new Parse.Query(Parse.User);
userQuery.include('expertise');
userQuery.equalTo('role', 'Expert');

var Expertise = Parse.Object.extend('Expertise');
var expertiseQuery = new Parse.Query(Expertise);
var InterviewRequest = Parse.Object.extend('InterviewRequest');

$(function() {
  var q = new Parse.Query(InterviewRequest);
  q.equalTo('company', currentCompany);
  q.include('expert');
  q.find({
    success: function(requests) {
      requests.forEach(function(request) {
        var stateId = request.get('state') || 'REQUESTED';
        var html = tmpl(document.getElementById('request-template').innerHTML, {
          candidateName: request.get('candidateName'),
          candidateEmail: request.get('candidateEmail'),
          candidatePhone: request.get('candidatePhone'),
          state: STATE_FLOW[stateId.toUpperCase()],
          companyView: true,
          expert: {
            name: getExpertName(request.get('expert'))
          }
        });
        $(html).appendTo($('#boxes'));
      });
    }
  });
});

function getExpertName(expert) {
  return expert.get('givenName') + ' ' + expert.get('familyName');
}
