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

var selected_roles = currentUser.get('expertise') || [];
// Only works if the user key is the same as the html id
var init_field = function(user, key, value) {
  var data = user.get(key);
  if (data) {
    $('#' + key).val(data);
  }
}

expertiseQuery.find().then(function(results) {
  currentUser.fetch().then(function(user) {
    selected_roles = user.get('expertise');
    init_field(user, 'price');
    init_field(user, 'details');
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
    renderPills()
  });
}, function (error) {
  console.log(error);
});

$('.form-editExpert').on('submit', function(e) {
  console.log('save the info to the user and the user to the roles');
  var $form = $(this);
  var data = $form.serializeArray();
  currentUser.set('expertise', selected_roles);
  var price = data[0].value;
  if (price[0] == '$') {
    price.splice(0,1);
  }
  currentUser.set('price', price);
  currentUser.set('details', data[1].value);
  currentUser.save();
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

var pillClickHandler = function(removeFrom, addTo, e) {
  var id = $(this).data('id');
  for (var i in removeFrom) {
    if (removeFrom[i].id == id) {
      var role = removeFrom.splice(i, 1)[0];
      addRole(addTo, role);
    }
  }
  renderPills();
};

var unselectRole = function(e) {
  pillClickHandler.call(this, selected_roles, unselected_roles, e);
};

var selectRole = function(e) {
  pillClickHandler.call(this, unselected_roles, selected_roles, e);
};

var addRole = function(role_list, role) {
  role_list.push(role);
  role_list.sort(function(a, b) {
    return a.get('name') > b.get('name');
  });
};

$('.selected_role_pills').on('click', '.role', unselectRole);
$('.unselected_role_pills').on('click', '.role', selectRole);

var renderPills = function() {
  $('.unselected_role_pills').html(getRolesPills(unselected_roles));
  $('.selected_role_pills').html(getRolesPills(selected_roles));
};

$('#fileupload').on('change', function(e) {
  console.log(this.files);
  var file = this.files[0];
  var img = document.createElement("img");
  $(img).width('100px');
  $(img).height('100px');

  img.classList.add("obj");
  img.file = file;
  var image = $('#image');
  image.html(img);
  image.show();

  var reader = new FileReader();
  reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
  reader.readAsDataURL(file);
});
