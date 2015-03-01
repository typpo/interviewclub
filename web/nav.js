define([], function() {
  var nav = {};

  nav.goToExpertDash = function() {
    window.location.href = '/expert_dash.html';
  };

  nav.goToExpertLandingPage = function() {
    window.location.href = "/edit_profile.html";
  };

  nav.goToCompanyLandingPage = function() {
    window.location.href = "/list.html";
  };

  return nav;
});