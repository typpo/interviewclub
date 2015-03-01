'use strict'
Parse.$ = jQuery;
Parse.initialize("WYKBPP1wtAdbqiTfjKvkrWhEObFvll67wivhst20", "O1AvRyOcTE1aUV9LvdiJ95Acg9EGyWIgpNf9WNCy");

var STATE_FLOW = {
  "REQUESTED": {
    name: 'Requested',
    className: 'requested',
    actions: [{
      button: "Accept",
      nextState: "ACCEPTED"
    }, {
      button: "Decline",
      nextState: "REJECTED"
    }]
  },
  "REJECTED": {
    name: 'Declined',
    className: 'rejected',
    actions: []
  },
  "ACCEPTED": {
    name: 'Accepted',
    className: 'accepted',
    actions: [{
      button: "Start video call now!",
      nextState: "IN_PROGRESS",
      handler: generateCall
    }]
  },
  "IN_PROGRESS": {
    name: 'Awaiting feedback',
    className: 'call',
    skipEmail: true,
    actions: [{
      button: 'Enter candidate feedback',
      nextState: 'WRITING_FEEDBACK',
      handler: showFeedbackForm
    }]
  },
  "WRITING_FEEDBACK": {
    name: 'Awaiting feedback',
    className: 'writing',
    skipEmail: true,
    actions: [],
    init: showFeedbackForm
  },
  "COMPLETED": {
    name: 'Complete',
    className: 'completed',
    actions: []
  }
};

var requestToState = {};
var requestLookup = {};

var currentUser = Parse.User.current();
if (!currentUser) {
  window.alert('the user should exist here, goto some login page now');
}

var userQuery = new Parse.Query(Parse.User);
userQuery.include('expertise');
userQuery.equalTo('username', currentUser.getUsername());

var InterviewRequest = Parse.Object.extend('InterviewRequest');

$(function() {
  userQuery.find({
    success: function(deepUser) {
      if (deepUser.length !== 1) {
        alert("Fuck");
      } else {
        addProfile(deepUser[0]);
      }
    }
  });

  var requestQuery = new Parse.Query(InterviewRequest);
  requestQuery.include('company');
  requestQuery.equalTo('expert', currentUser);
  requestQuery.find({
    success: function(requests) {
      addRequests(requests);
      $('.actions').on('click', '.action-button', handleRequestStateChange);
    }
  });
});

function handleRequestStateChange(e) {
  var newState = $(this).data('next-state').toUpperCase();
  var requestId = $(this).data('request-id');
  var handler;
  for (var i in requestToState[requestId].actions) {
    var action = requestToState[requestId].actions[i];
    if (action.nextState == newState) {
      handler = action.handler;
      break;
    }
  }

  updateRequestState(requestId, newState, function(requestId, newState) {
    afterRequestStateUpdate(requestId, newState);
    if (handler) {
      handler(requestId, newState);
    }
  });
}

function afterRequestStateUpdate(requestId, newState) {
  var newStateFlow = STATE_FLOW[newState];
  requestToState[requestId] = newStateFlow;
  $('#' + requestId).find('.state').text(newStateFlow.name);
  updateActionButtons(requestId, newStateFlow);
}

function updateActionButtons(requestId, stateFlow) {
  var actionsHtml = tmpl(document.getElementById('request-action').innerHTML, {
    requestId: requestId,
    state: stateFlow
  });
  $('#' + requestId).find('.actions').html(actionsHtml);
}

function updateRequestState(requestId, newState, callback) {
  new Parse.Query(InterviewRequest).get(requestId, {
    success: function(ir) {
      ir.set('state', newState);
      ir.save();
      if (!newState.skipEmail) {
        sendUpdateEmail();
        if (newState == 'IN_PROGRESS') {
          // Start a video call
          var userRand = Math.floor(Math.random() * 1e7);
          $.get('/candidateEmail?email=' + ir.get('candidateEmail') +
                '&user=' + userRand +
                '&candidateName=' + ir.get('candidateName') +
                '&expertName=' + currentUser.get('givenName')
                , function() {
              window.location.href = '/call.html?user=' + (Math.floor(Math.random() * 1e7)) +
                '&code=' + (Math.floor(Math.random() * 1e7)) + '&call=' + userRand;
          });
        }
      }
      callback(requestId, newState);
    }, error: function() {
      alert("Whoops, couldn't update the request. Please try again later.");
    }
  });
}

function generateCall(requestId) {
  // implement
}

function sendUpdateEmail() {
  // implement
}

function showFeedbackForm(requestId) {
  var formHtml = tmpl(document.getElementById('feedback-template').innerHTML, {
    requestId: requestId
  });
  $('#' + requestId).find('.feedback-form-container').html(formHtml);

  $('.feedback-submit').off('click');  // clear old handlers if any.
  $('.feedback-submit').on('click', submitFeedback);
}


var Feedback = Parse.Object.extend('Feedback');

function submitFeedback() {
  var $form = $(this).closest('.form-feedback');
  var requestId = $form.data("request-id");

  var feedback = new Feedback();

  var data = $form.serializeArray();
  for (var i in data) {
    var field = data[i];
    if (field.name == 'skillLevel') {
      feedback.set(field.name, parseInt(field.value, 10));
    } else {
      feedback.set(field.name, field.value);
    }
  }

  //currentUser.set('details', data[1].value);
  feedback.save();
  var request = requestLookup[requestId];
  request.set('feedback', feedback);
  request.save();

  updateRequestState(requestId, "COMPLETED", hideFeedbackForm);
}

function hideFeedbackForm(requestId, newState) {
  $('#' + requestId).find('.feedback-form-container').hide();
  afterRequestStateUpdate(requestId, newState);
}

function addRequests(requests){
  requests.forEach(function(request) {
    requestLookup[request.id] = request;
    var stateName = request.get('state') || 'REQUESTED';
    var stateFlow = STATE_FLOW[stateName.toUpperCase()];
    requestToState[request.id] = stateFlow;
    var requestsHtml = tmpl(document.getElementById('request-template').innerHTML, {
      requestId: request.id,
      candidateName: request.get('candidateName'),
      candidateEmail: request.get('candidateEmail'),
      candidatePhone: request.get('candidatePhone'),
      state: STATE_FLOW[stateName.toUpperCase()],
      companyView: false,
      company: {
        name: request.get('company').get('companyName')
      }
    });
    $('#requests').append(requestsHtml);
    if (stateFlow.init) {
      stateFlow.init(request.id);
    }
  });
}

function addProfile(user) {
  var image = user.get('image');
  var socialImage = user.get('socialImage');
  var expertise = user.get('expertise');
  var skills = '';
  for (var i in expertise) {
    if (i > 0) skills += ', ';
    skills += expertise[i].get('name');
  }
  if (!skills.length) {
    skills = 'No skills listed. C\'mon, you\'re better than that!';
  }
  var templateParams = {
    firstName: user.get('givenName') || '',
    lastName: user.get('familyName') || '',
    name: user.getUsername(),
    desc: user.get('details'),
    hourly: user.get('price'),
    organization: user.get('organization') || '',
    social: user.get('social') || [],
    image: image ? image.url() : socialImage ? socialImage : '',
    skills: skills,
    expert_id: user.id,
    ui: 'profile'
  };
  var $box = $(tmpl(document.getElementById('box-template').innerHTML, templateParams));
  $('#boxes').append($box);
  return $box;
}
