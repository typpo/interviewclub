$(function() {
  'use strict'
  Parse.$ = jQuery;
  Parse.initialize("WYKBPP1wtAdbqiTfjKvkrWhEObFvll67wivhst20", "O1AvRyOcTE1aUV9LvdiJ95Acg9EGyWIgpNf9WNCy");

  $('.form-signin').on('submit', function(e) {

      // Prevent Default Submit Event
      e.preventDefault();

      // Get data from the form and put them into variables
      var data = $(this).serializeArray(),
          username = data[0].value,
          email = data[1].value,
          password = data[2].value;

      // Call Parse Login function with those variables
      Parse.User.logIn(username, password, {
          // If the username and password matches
          success: function(user) {
              alert('Welcome!');
          },
          // If there is an error
          error: function(user, error) {
              console.log(error);
          }
      });

  });
});
