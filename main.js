'use strict'
Parse.$ = jQuery;
Parse.initialize("WYKBPP1wtAdbqiTfjKvkrWhEObFvll67wivhst20", "O1AvRyOcTE1aUV9LvdiJ95Acg9EGyWIgpNf9WNCy");

var EXPERT_ROLE = "Expert";
var COMPANY_ROLE = "Company";

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
  });
});

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
  Parse.User.logIn(email, password).then(function() {
    window.alert('log in, not sign up');
  }, function(error) {
    window.alert('total fail');
  });
};
