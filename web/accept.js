Parse.$ = jQuery;
Parse.initialize("WYKBPP1wtAdbqiTfjKvkrWhEObFvll67wivhst20", "O1AvRyOcTE1aUV9LvdiJ95Acg9EGyWIgpNf9WNCy");

var InterviewRequest = Parse.Object.extend('InterviewRequest');
$(function() {
  var requestId = getParameterByName('id');
  console.log(requestId);
  new Parse.Query(InterviewRequest).get(requestId, {
    success: function(ir) {
      console.log(ir);
      ir.set('state', 'ACCEPTED');
      ir.save();

      // send email to company
      // TODO fix this
      $.get('/accept?email=' + ir.get('company').get('username') +
            '&company=' + ir.get('company').get('companyName') +
            '&price=' + ir.get('expert').get('price'), function() {
        setTimeout(function() {
          window.location.href='/edit_profile.html';
        }, 1000);
      });
    },
  });
});

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
