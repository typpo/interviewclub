'use strict'
Parse.$ = jQuery;
Parse.initialize("WYKBPP1wtAdbqiTfjKvkrWhEObFvll67wivhst20", "O1AvRyOcTE1aUV9LvdiJ95Acg9EGyWIgpNf9WNCy");

var EXPERT_ROLE = "Expert";
var COMPANY_ROLE = "Company";

$('#login').on('click', function(e) {
  $('#loginModal').modal('show');
});

$('.open-company-signup').on('click', function() {
  $('#companySignupModal').modal('show');
  setTimeout(function() {
    $('#companyEmail').focus();
  }, 500);
  return false;
});
$('.open-expert-signup').on('click', function() {
  $('#expertSignupModal').modal('show');
  setTimeout(function() {
    $('#expertEmail').focus();
  }, 500);
  return false;
});

$('.form-login').on('submit', function(e) {
  var $form = $(this);
  // Prevent Default Submit Event
  e.preventDefault();

  // Get data from the form and put them into variables
  var data = $form.serializeArray(),
    email = data[0].value,
    password = data[1].value;

  login(email, password).then(function(user) {
    $('#retry').hide();
    navBasedOnRole(getUserRole());
  }, function() {
    $('#retry').show();
    $form.find('[type=password]').val('');
  });
});

$('.form-createExpert').on('submit', function(e) {
  var $form = $(this);
  // Prevent Default Submit Event
  e.preventDefault();

  // Get data from the form and put them into variables
  var data = $form.serializeArray(),
    email = data[0].value,
    password = data[1].value;
  var userData = {
    role: EXPERT_ROLE
  };

  signUp(email, password, userData, function() {
    $form.html('');
    goToExpertLandingPage();
  });
});

$('.form-createCompany').on('submit', function(e) {
  var $form = $(this);
  // Prevent Default Submit Event
  e.preventDefault();

  // Get data from the form and put them into variables
  var data = $form.serializeArray(),

    email = data[1].value,
    password = data[2].value;
  var userData = {
    role: COMPANY_ROLE,
    companyName: data[0].value
  };

  signUp(email, password, userData, function() {
    $form.html('');
    goToCompanyLandingPage();
  });
});

$('.form-createExpert-launchpage').on('submit', function(e) {
  $.get('/signup?email=' + $('#expertEmail').val() + '&type=expert', function() {
    alert("You've been added to the waiting list.  Thank you!");
    $('#expertSignupModal').modal('hide');
  });
  return false;
});

$('.form-createCompany-launchpage').on('submit', function(e) {
  $.get('/signup?email=' + $('#companyEmail').val() + '&type=company', function() {
    alert("You've been added to the waiting list.  Thank you!");
    $('#companySignupModal').modal('hide');
  });
  return false;
});

$('#ctaForm').on('submit', function(e) {
  $.get('/signup?email=' + $('#ctaEmail').val() + '&type=cta', function() {
    alert("You've been added to the waiting list.  Thank you!");
  });
  return false;
});

// Focus hacks below
$('#company').on('click', function() {
  setTimeout(function() {
    $('#companyEmail').focus();
  }, 500);
});
$('#expert').on('click', function() {
  setTimeout(function() {
    $('#expertEmail').focus();
  }, 500);
});

var getUserRole = function() {
  var currentUser = Parse.User.current();
  if (currentUser) {
    return currentUser.get("role");
  }
};

var signUp = function(email, password, data, successCallback, errorCallback) {
  Parse.User.signUp(email, password, data).then(function(x, y, z) {
      console.log('user created success');
      if (successCallback) {
        successCallback();
      }
    }, function(x, y, z) {
      console.log('user create failed!')
      // I think this code might be a fail because the user exists already.
      if (error.code == 202) {
        login(email, password);
      }
      if (errorCallback) {
        errorCallback();
      }
    }
  );
};

var login = function(email, password) {
  return Parse.User.logIn(email, password);
};

var navBasedOnRole = function(role) {
  if (role == EXPERT_ROLE) {
    goToExpertLandingPage();
  } else if (role == COMPANY_ROLE) {
    goToCompanyLandingPage();
  }
}

var goToExpertLandingPage = function() {
  window.location.href = "/edit_profile.html";
}

var goToCompanyLandingPage = function() {
  window.location.href = "/list.html";
}
