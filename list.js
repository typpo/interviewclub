'use strict';

$(function() {

  addBox({
    name: 'Andy Kearney',
    tags: 'javascript, java, jslayout, angular, chrome extensions',
    desc: 'I love pizza and have screened thousands of resumes and conduct interviews for Google.  I enjoy focusing on coding and algo questions that mimic situations your candidates will encounter in the real world.',
    hourly: 150,
    img: 'http://i.imgur.com/7NIuzYp.png',
  });

  console.log('it is done');
});

function addBox(opts) {
  var $box = tmpl(document.getElementById('box-template').innerHTML, opts);
  $('#boxes').append($box);
}
