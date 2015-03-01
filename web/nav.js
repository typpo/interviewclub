define([], function() {
  var nav = {};

  nav.goToExpertDash = function() {
    window.location.href = '/expert_dash.html';
  };

  return nav;
});