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

  var currentExpertId = -1;
  setTimeout(function() {
    // I hate myself
    $('.request-modal-button').on('click', function() {
      currentExpertId = $(this).data('expert-id');
      return true; // bubble
    });
  }, 800);
  $('.form-createRequest').on('submit', function(e) {
    var name = $('#candidateName').val();
    var email = $('#candidateEmail').val();
    var phone = $('#candidatePhone').val();
    var focus = $('#candidateFocus').val();

    userQuery.get(currentExpertId, {
      success: function(expert) {
        var ir = new InterviewRequest();
        ir.set('candidateName', name);
        ir.set('candidateEmail', email);
        ir.set('candidatePhone', phone);
        ir.set('candidateFocus', focus);
        ir.set('company', currentCompany);
        ir.set('expert', expert);
        ir.save({
          success: function(saved) {
            // Send to email endpoint
            $.get('/send?email=' + expert.get('username') + '&company=' + currentCompany.get('companyName')
                 + '&requestId=' + saved.id + '&price=' + expert.get('price'));
          }
        });

        $('#requestModal').modal('hide');
      }
    });

    return false;
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
  var filterIndex = $.inArray(id, appliedFilters);
  if (filterIndex === -1) {
    appliedFilters.push(id);
  } else {
    appliedFilters.splice(filterIndex, 1);
  }
  applyFilters();
}

function applyFilters() {
  var filteredUsers = Object.keys(userToBox);  // all users.
  for (var i in appliedFilters) {
    var expertiseId = appliedFilters[i];
    var expertUsers = expertiseToUser[expertiseId];
    if (expertUsers) {
      filteredUsers = $(filteredUsers).filter(expertUsers);
    } else {
      filteredUsers = [];
      break;  // no users match.
    }
  }
  updateVisibleBoxs(filteredUsers);
}

function updateVisibleBoxs(usersToShow) {
  if (!usersToShow.length) {
    $('#zerohero').show();
  } else {
    $('#zerohero').hide();
  }

  for (var i in userToBox) {
    if ($.inArray(i, usersToShow) !== -1) {
      userToBox[i].show();
    } else {
      userToBox[i].hide();
    }
  }
}

function setUpUser(user) {
  var box = addBox(user);
  userToBox[user.id] = box;
  var userExpertise = user.get("expertise");
  for (var i in userExpertise) {
    if (expertiseToUser[userExpertise[i].id]) {
      expertiseToUser[userExpertise[i].id].push(user.id);
    } else {
      expertiseToUser[userExpertise[i].id] = [user.id];
    }
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
  var $box = $(tmpl(document.getElementById('box-template').innerHTML, {
    name: opts.getUsername(),
    desc: opts.get('details'),
    hourly: opts.get('price'),
    image: image ? image.url() : '',
    skills: skills,
    expert_id: opts.id
  }));
  $('#boxes').append($box);
  return $box;
}
