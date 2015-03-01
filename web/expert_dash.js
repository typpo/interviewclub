'use strict'
Parse.$ = jQuery;
Parse.initialize("WYKBPP1wtAdbqiTfjKvkrWhEObFvll67wivhst20", "O1AvRyOcTE1aUV9LvdiJ95Acg9EGyWIgpNf9WNCy");

var currentUser = Parse.User.current();
if (!currentUser) {
  window.alert('the user should exist here, goto some login page now');
}

var userQuery = new Parse.Query(Parse.User);
userQuery.include('expertise');
userQuery.equalTo('username', currentUser.getUsername());

$(function() {
  userQuery.find({
    success: function(deepUser) {
      if (deepUser.length !== 1) {
        alert("Fuck");
      } else {
        addBox(deepUser[0]);
      }
    }
  });
});

function addBox(user) {
  var image = user.get('image');
  var socailImage = opts.get('socialImage');
  var expertise = user.get('expertise');
  var skills = '';
  for (var i in expertise) {
    if (i > 0) skills += ', ';
    skills += expertise[i].get('name');
  }
  if (!skills.length) {
    skills = 'No skills listed. C\'mon, you\'re better than that!';
  }
  var templateParams = {
    firstName: user.get('givenName') || '',
    lastName: user.get('familyName') || '',
    name: user.getUsername(),
    desc: user.get('details'),
    hourly: user.get('price'),
    organization: user.get('organization') || '',
    social: user.get('social') || [],
    image: image ? image.url() : socailImage ? socailImage : '',
    skills: skills,
    expert_id: user.id,
    ui: 'profile'
  };
  var $box = $(tmpl(document.getElementById('box-template').innerHTML, templateParams));
  $('#boxes').append($box);
  return $box;
}
