'use strict';

var STATE_FLOW = {
  "REQUESTED": {
    name: 'Requested',
    className: 'requested'
  },
  "REJECTED": {
    name: 'Rejected',
    className: 'rejected'
  },
  "ACCEPTED": {
    name: 'Accepted',
    className: 'accepted'
  },
  "IN_PROGRESS": {
    name: 'Awaiting feedback',
    className: 'call'
  },
  "WRITING_FEEDBACK": {
    name: 'Awaiting feedback',
    className: 'writing'
  },
  "COMPLETED": {
    name: 'Complete',
    className: 'completed'
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
          requestId: request.id,
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
      $('.show-feedback').on('click', function(e) {
        $(this).hide();
        showFeedback($(this).data('request-id'));
      });
    }
  });
});

function showFeedback(requestId) {
  var q = new Parse.Query(InterviewRequest);
  q.equalTo('objectId', requestId);
  q.include('feedback');
  q.find({
    success: function(request) {
      if (request.length !== 1) {
        console.log("Something wrong with the interview request");
      }
      var feedback = request[0].get('feedback');
      if (!feedback) {
        alert('Oops, looks like somebody scammed you!');
        return;
      }
      var feedbackHtml = tmpl(document.getElementById('feedback-template').innerHTML, {
        requestId: requestId,
        viewOnly: true
      });
      $('#' + requestId).find('.feedback-container').html(feedbackHtml);
      $('#' + requestId).find('.feedback-container').show();
    }, error: function() {
      console.log("Request not found");
    }
  });
}

function getExpertName(expert) {
  return expert.get('givenName') + ' ' + expert.get('familyName');
}
