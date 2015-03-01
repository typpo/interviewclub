'use strict'
Parse.$ = jQuery;
Parse.initialize("WYKBPP1wtAdbqiTfjKvkrWhEObFvll67wivhst20", "O1AvRyOcTE1aUV9LvdiJ95Acg9EGyWIgpNf9WNCy");

var Expertise = Parse.Object.extend('Expertise');
var expertiseQuery = new Parse.Query(Expertise);
var user_image;
var unselected_expertises = [];
var current_socials = [];


var currentUser = Parse.User.current();
if (!currentUser) {
  window.alert('the user should exist here, goto some login page now');
}

var selected_expertises = currentUser.get('expertise') || [];
// Only works if the user key is the same as the html id
var init_field = function(user, key, value) {
  var data = user.get(key);
  if (data) {
    $('#' + key).val(data);
  }
}

expertiseQuery.find().then(function(results) {
  currentUser.fetch().then(function(user) {
    selected_expertises = user.get('expertise');
    init_field(user, 'price');
    init_field(user, 'details');
    init_field(user, 'organization');
    init_field(user, 'givenName');
    init_field(user, 'familyName');
    var socialImage = user.get('socialImage');
    var userImage = user.get('image');
    if (userImage || socialImage) {
      var img = document.createElement("img");
      $(img).width('100px');
      $(img).height('100px');
      img.src = userImage ? userImage.url() : socialImage;

      var image = $('#image');
      image.html(img);
      image.show();
    }
    current_socials = user.get('social');
    renderSocialPills(current_socials);
    $('.social_pills').on('click', '.remove_pill', function(e) {
      var index = $(this).data('index');
      current_socials.splice(index, 1);
      renderSocialPills(current_socials);
    });
    var copy_expertises_hack = [];
    unselected_expertises = results.filter(function(expertise) {
      for (var i in selected_expertises) {
        if (selected_expertises[i].id == expertise.id) {
          copy_expertises_hack.push(expertise);
          return false;
        }
      }
      return true;
    });
    selected_expertises = copy_expertises_hack;
    renderPills()
  });
}, function (error) {
  console.log(error);
});

$('.form-editExpert').on('submit', function(e) {
  console.log('save the info to the user and the user to the expertises');
  var $form = $(this);
  var data = $form.serializeArray();
  currentUser.set('expertise', selected_expertises);
  var price = data[0].value;
  if (price[0] == '$') {
    price.splice(0,1);
  }
  currentUser.set('price', price);
  currentUser.set('details', data[1].value);
  currentUser.set('givenName', data[2].value);
  currentUser.set('familyName', data[3].value);
  currentUser.set('organization', data[4].value);
  currentUser.set('social', current_socials);
  // This should really wait for the upload promise...
  if (user_image) currentUser.set('image', user_image);
  currentUser.save();
});

var getexpertisesPills = function(expertises) {
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

var pillClickHandler = function(removeFrom, addTo, e) {
  var id = $(this).data('id');
  for (var i in removeFrom) {
    if (removeFrom[i].id == id) {
      var expertise = removeFrom.splice(i, 1)[0];
      addexpertise(addTo, expertise);
    }
  }
  renderPills();
};

var unselectexpertise = function(e) {
  pillClickHandler.call(this, selected_expertises, unselected_expertises, e);
};

var selectexpertise = function(e) {
  pillClickHandler.call(this, unselected_expertises, selected_expertises, e);
};

var addexpertise = function(expertise_list, expertise) {
  expertise_list.push(expertise);
  expertise_list.sort(function(a, b) {
    return a.get('name') > b.get('name');
  });
};

$('.selected_expertise_pills').on('click', '.expertise', unselectexpertise);
$('.unselected_expertise_pills').on('click', '.expertise', selectexpertise);

var renderPills = function() {
  $('.unselected_expertise_pills').html(getexpertisesPills(unselected_expertises));
  $('.selected_expertise_pills').html(getexpertisesPills(selected_expertises));
};

var renderSocialPills = function(socials) {
  var pills = [];
  for (var i in socials) {
    var social = socials[i];
    pills.push(tmpl('social_pill', {
      index: i,
      name: social.name,
      url: social.url
    }));
  }
  $('.social_pills').html(pills.join(''));
};

var uploadFile = function(file) {
  var parseFile = new Parse.File(file.name, file);
  parseFile.save().then(function(x) {
    user_image = parseFile;
  }, function(error) {
    console.log(error);
  });
};

var showImage = function(file) {
  var img = document.createElement("img");
  $(img).width('100px');
  $(img).height('100px');

  img.file = file;
  var image = $('#image');
  image.html(img);
  image.show();
  var reader = new FileReader();
  reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
  reader.readAsDataURL(file);
};

$('#social_submit').on('click', function(e) {
  e.preventDefault();
  var $name = $('#social_name');
  var $url = $('#social_url');
  var name = $name.val();
  var url = $url.val();
  if (name && url) {
    current_socials.push({
      name: name,
      url: url,
      index: current_socials.length
    });
    renderSocialPills(current_socials);
    $name.val('');
    $url.val('');
  }
});

$('#fileupload').on('change', function(e) {
  console.log(this.files);
  var file = this.files[0];
  showImage(file);
  uploadFile(file);
});

var goToExpertDash = function() {
  window.location.href = '/expert_dash.html';
};
