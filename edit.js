'use strict'
Parse.$ = jQuery;
Parse.initialize("WYKBPP1wtAdbqiTfjKvkrWhEObFvll67wivhst20", "O1AvRyOcTE1aUV9LvdiJ95Acg9EGyWIgpNf9WNCy");

var Expertise = Parse.Object.extend('Expertise');
var expertiseQuery = new Parse.Query(Expertise);

var currentUser = Parse.User.current();
if (!currentUser) {
  window.alert('the user should exist here, goto some login page now');
}

console.log(currentUser);
if (currentUser.price) {
  // TODO update price string
}

var currentRoles = currentUser.get('roles') || [];

expertiseQuery.find().then(function(results) {
  console.log(results);
  var html = getRolesPills(results);
  $('.role_pills').html(html);
}, function (error) {
  console.log(error);
});

$('.form-editExpert').on('submit', function(e) {
  console.log('save the info to the user and the user to the roles');
});

var getRolesPills = function(roles) {
  var pills_html = [];
  for (var i in roles) {
    pills_html.push(tmpl('role_pill', {
      role: {
        name: roles[i].get('name')
      }
    }));
  }
  console.log(pills_html);
  return pills_html.join('');
}
