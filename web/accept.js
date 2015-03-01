Parse.$ = jQuery;
Parse.initialize("WYKBPP1wtAdbqiTfjKvkrWhEObFvll67wivhst20", "O1AvRyOcTE1aUV9LvdiJ95Acg9EGyWIgpNf9WNCy");

var InterviewRequest = Parse.Object.extend('InterviewRequest');

var ACCEPTED = "ACCEPTED";
$(function() {
  var requestId = getParameterByName('id');
  console.log(requestId);
  new Parse.Query(InterviewRequest).get(requestId, {
    success: function(ir) {
      ir.set('state', ACCEPTED);
      ir.save();

      // send email to company
      // TODO fix this
      var company = ir.get('company');
      company.fetch({
        success: function(companyObj) {
          console.log('got go', companyObj);
          var expert = ir.get('expert');
          expert.fetch({
            success: function(expertObj) {
              console.log('got expert');
              $.get('/accept?email=' + companyObj.get('username') +
                    '&company=' + companyObj.get('companyName') +
                    '&price=' + expertObj.get('price') + '&state=' + ACCEPTED, function() {
                setTimeout(function() {
                  window.open('/edit_profile.html', '_blank');
                }, 1000);
              });
            }
          });
        },
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
