'use strict';
Parse.$ = jQuery;
Parse.initialize("WYKBPP1wtAdbqiTfjKvkrWhEObFvll67wivhst20", "O1AvRyOcTE1aUV9LvdiJ95Acg9EGyWIgpNf9WNCy");

var currentCompany = Parse.User.current();
var userQuery = new Parse.Query(Parse.User);
userQuery.include('expertise');
userQuery.equalTo('role', 'Expert');

var Expertise = Parse.Object.extend('Expertise');
var expertiseQuery = new Parse.Query(Expertise);

var EXPERT_ROLE = "Expert";
var COMPANY_ROLE = "Company";

var userToBox = {};  // user id to box in list
var expertiseToUser = {};  // expertise id to user id
var expertiseMap = {};  // expertise id to name

var appliedFilters = [];

$(function() {
  if (!checkCompanyLogin()) {
    alert('This page is just for companies!');
    window.location.href = 'index.html';
    return;
  }

  expertiseQuery.find({
    success: function(results) {
      for (var i in results) {
        var expertise = results[i];
        expertiseMap[expertise.id] = expertise.get("name");
      }
      setUpFilters(results);
    }
  });

  userQuery.find({
    success: function(users) {
      for (var i in users) {
        setUpUser(users[i]);
      }
    }
  });

  var t = null;
  $('#search').on('keydown', function() {
    if (t) clearTimeout(t);
    t = setTimeout(function() {
      var val = $('#search').val();
      if (val.length > 2) {
        $('#searchterm-container').show();
        filter(val);
      } else {
        $('#searchterm-container').hide();
      }
    }, 250);
  });

  $('#filter_container').on('click', '.expertise', toggleFilter);
});

function toggleFilter(e) {
  $(this).toggleClass('selected');
  var id = $(this).data('id');
}

function setUpUser(user) {
  var box = addBox(user);
  userToBox[user.id] = box;
  var userExpertise = user.get("expertise");
  for (var i in userExpertise) {
    expertiseToUser[userExpertise[i].id] = user.id;
  }
};

function checkCompanyLogin() {
  var user = Parse.User.current();
  return user.get("role") === COMPANY_ROLE;
}

function setUpFilters(expertises) {
  var expertiseHtml = getExpertisesPills(expertises);
  $('#filter_container').html(expertiseHtml);
}

var getExpertisesPills = function(expertises) {
  var pills_html = [];
  for (var i in expertises) {
    pills_html.push(tmpl('expertise_pill', {
      expertise: {
        id: expertises[i].id,
        name: expertises[i].get('name')
      }
    }));
  }
  console.log(pills_html);
  return pills_html.join('');
};

function filter(term) {
  $('#boxes').html('');
  data.forEach(function(obj) {
    var str = obj.name + obj.tags + obj.desc;
    if (str.toLowerCase().indexOf(term) > -1) {
      addBox(obj);
    }
  });
  $('#searchterm').text(term);
}

function exampleBox() {
  addBox();
}

function addBox(opts) {
  var image = opts.get('image');
  var expertise = opts.get('expertise');
  var skills = '';
  for (var i in expertise) {
    if (i > 0) skills += ', ';
    skills += expertise[i].get('name');
  }
  var $box = tmpl(document.getElementById('box-template').innerHTML, {
    name: opts.getUsername(),
    desc: opts.get('details'),
    hourly: opts.get('price'),
    image: image ? image.url() : '',
    skills: skills
  });
  $('#boxes').append($box);
  return $box;
}
