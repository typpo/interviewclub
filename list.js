'use strict';

var data = [
{
    name: 'Andy Kearney',
    tags: 'javascript, java, jslayout, angular, chrome extensions',
    desc: 'I love pizza and have screened thousands of resumes and conduct interviews for Google.  I enjoy focusing on coding and algo questions that mimic situations your candidates will encounter in the real world.',
    hourly: 150,
    img: 'http://i.imgur.com/7NIuzYp.png',
}
];

$(function() {
  // TODO get data
  data.forEach(function(obj) {
    addBox(obj);
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
  var $box = tmpl(document.getElementById('box-template').innerHTML, opts);
  $('#boxes').append($box);
}
