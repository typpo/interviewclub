'use strict'
Parse.$ = jQuery;
Parse.initialize("WYKBPP1wtAdbqiTfjKvkrWhEObFvll67wivhst20", "O1AvRyOcTE1aUV9LvdiJ95Acg9EGyWIgpNf9WNCy");

$('.form-createExpert').on('submit', function(e) {

  var $form = $(this);

  // Prevent Default Submit Event
  e.preventDefault();

  // Get data from the form and put them into variables
  var data = $form.serializeArray(),
      email = data[0].value,
      password = data[1].value;

  // TODO create a roll for experts.
  // Call Parse Login function with those variables
  Parse.User.signUp(email, password).then(function(x, y, z) {
    console.log('user created success');
    $form.html('');
  }, function(x, y, z) {
    console.log('user create failed!')
    // I think this code might be a fail because the user exists already.
    if (x.code == 202) {
      login(email, password);
    }
  });
});

$('#company').click(function(e) {
  console.log('company');
});

$('#expert').click(function(e) {
  console.log('expert');
});

var login = function(email, password) {
  Parse.User.logIn(email, password).then(function() {
    window.alert('log in, not sign up');
  }, function(error) {
    window.alert('total fail');
  });
};
