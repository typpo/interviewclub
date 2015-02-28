'use strict';
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
  q.find({
    success: function(requests) {
      requests.forEach(function(request) {
        var state = request.get('state') || 'REQUESTED';
        var html = tmpl(document.getElementById('box-template').innerHTML, {
          candidateName: request.get('candidateName'),
          candidateEmail: request.get('candidateEmail'),
          candidatePhone: request.get('candidatePhone'),
          state: state,
        });
        $(html).appendTo($('#boxes'));
      });
    }
  });
});
