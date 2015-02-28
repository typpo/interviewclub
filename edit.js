'use strict'
Parse.$ = jQuery;
Parse.initialize("WYKBPP1wtAdbqiTfjKvkrWhEObFvll67wivhst20", "O1AvRyOcTE1aUV9LvdiJ95Acg9EGyWIgpNf9WNCy");

var Expertise = Parse.Object.extend('Expertise');
var expertiseQuery = new Parse.Query(Expertise);
var unselected_roles = [];

var currentUser = Parse.User.current();
if (!currentUser) {
  window.alert('the user should exist here, goto some login page now');
}

console.log(currentUser);
if (currentUser.price) {
  // TODO update price string
}

var selected_roles = currentUser.get('expertise') || [];

expertiseQuery.find().then(function(results) {
  currentUser.fetch().then(function(user) {
    selected_roles = user.get('expertise');
    console.log(results);
    var copy_roles_hack = [];
    unselected_roles = results.filter(function(role) {
      for (var i in selected_roles) {
        if (selected_roles[i].id == role.id) {
          copy_roles_hack.push(role);
          return false;
        }
      }
      return true;
    });
    selected_roles = copy_roles_hack;
    var html = getRolesPills(unselected_roles);
    $('.unselected_role_pills').html(getRolesPills(unselected_roles));
    $('.selected_role_pills').html(getRolesPills(selected_roles));
  });
}, function (error) {
  console.log(error);
});

$('.form-editExpert').on('submit', function(e) {
  console.log('save the info to the user and the user to the roles');
  currentUser.save('expertise', selected_roles);
});

var getRolesPills = function(roles) {
  var pills_html = [];
  for (var i in roles) {
    pills_html.push(tmpl('role_pill', {
      role: {
        id: roles[i].id,
        name: roles[i].get('name')
      }
    }));
  }
  console.log(pills_html);
  return pills_html.join('');
};

var unselectRole = function(e) {
  var id = $(this).data('id');
  for (var i in selected_roles) {
    if (selected_roles[i].id == id) {
      var role = selected_roles.splice(i, 1)[0];
      addRole(unselected_roles, role);
    }
  }
  $('.unselected_role_pills').html(getRolesPills(unselected_roles));
  $('.selected_role_pills').html(getRolesPills(selected_roles));
};

var selectRole = function(e) {
  var id = $(this).data('id');
  for (var i in unselected_roles) {
    if (unselected_roles[i].id == id) {
      var role = unselected_roles.splice(i, 1)[0];
      addRole(selected_roles, role);
    }
  }
  $('.unselected_role_pills').html(getRolesPills(unselected_roles));
  $('.selected_role_pills').html(getRolesPills(selected_roles));
};

var addRole = function(role_list, role) {
  role_list.push(role);
  role_list.sort(function(a, b) {
    return a.get('name') > b.get('name');
  });
};

$('.selected_role_pills').on('click', '.role', unselectRole);
$('.unselected_role_pills').on('click', '.role', selectRole);

