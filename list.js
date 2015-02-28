'use strict';
Parse.$ = jQuery;
Parse.initialize("WYKBPP1wtAdbqiTfjKvkrWhEObFvll67wivhst20", "O1AvRyOcTE1aUV9LvdiJ95Acg9EGyWIgpNf9WNCy");

var currentCompany = Parse.User.current();
var query = new Parse.Query(Parse.User);
query.equalTo('role', 'Expert');

$(function() {
  query.find({
    success: function(users) {
      for (var i in users) {
        addBox(users[i]);
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
});

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
  var $box = tmpl(document.getElementById('box-template').innerHTML, {
    name: opts.getUsername(),
    desc: opts.get('details'),
    hourly: opts.get('price')
  });
  $('#boxes').append($box);
}
