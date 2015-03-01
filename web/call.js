var global_username = '';
$(function() {
  var user = getParameterByName('user');
  var code = getParameterByName('code');
  var userToCall = getParameterByName('call');


  /*** After successful authentication, show user interface ***/

  var showUI = function() {
    $('video').show();
    $('div#call').show();
    if (!userToCall) {
      $('#callButton').hide();
      $('#callUserName').hide();
    }
  }


  //*** Set up sinchClient ***/

  sinchClient = new SinchClient({
    applicationKey: '6cc8e402-f4e9-4e0d-ac53-4308fe2e49ad',
    capabilities: {calling: true, video: true},
    supportActiveConnection: true,
    //Note: For additional loging, please uncomment the three rows below
    onLogMessage: function(message) {
      console.log(message);
    },
  });

  sinchClient.startActiveConnection();

  /*** Name of session, can be anything. ***/
  var sessionName = 'sinchSessionVIDEO-' + sinchClient.applicationKey;


  /*** Define listener for managing calls ***/

  var callListeners = {
    onCallProgressing: function(call) {
      $('audio#ringback').prop("currentTime",0);
      $('audio#ringback').trigger("play");

      //Report call stats
      $('div#callLog').append('<div id="stats">Ringing...</div>');
    },
    onCallEstablished: function(call) {
      $('video#outgoing').attr('src', call.outgoingStreamURL);
      $('video#incoming').attr('src', call.incomingStreamURL);
      $('audio#ringback').trigger("pause");
      $('audio#ringtone').trigger("pause");

      //Report call stats
      var callDetails = call.getDetails();
      $('div#callLog').append('<div id="stats">Answered at: '+(callDetails.establishedTime && new Date(callDetails.establishedTime))+'</div>');
    },
    onCallEnded: function(call) {
      $('audio#ringback').trigger("pause");
      $('audio#ringtone').trigger("pause");

      $('video#outgoing').attr('src', '');
      $('video#incoming').attr('src', '');

      $('button').removeClass('incall');
      $('button').removeClass('callwaiting');

      //Report call stats
      var callDetails = call.getDetails();
      $('div#callLog').append('<div id="stats">Ended: '+new Date(callDetails.endedTime)+'</div>');
      $('div#callLog').append('<div id="stats">Duration (s): '+callDetails.duration+'</div>');
      $('div#callLog').append('<div id="stats">End cause: '+call.getEndCause()+'</div>');
      if(call.error) {
        $('div#callLog').append('<div id="stats">Failure message: '+call.error.message+'</div>');
      }
    }
  }

  /*** Set up callClient and define how to handle incoming calls ***/

  var callClient = sinchClient.getCallClient();
  callClient.initStream().then(function() { // Directly init streams, in order to force user to accept use of media sources at a time we choose
    $('div.frame').not('#chromeFileWarning').show();
  });
  var call;

  callClient.addEventListener({
    onIncomingCall: function(incomingCall) {
    //Play some groovy tunes
    $('audio#ringtone').prop("currentTime",0);
    $('audio#ringtone').trigger("play");

    //Print statistics
    $('div#callLog').append('<div id="title">Incoming call from ' + incomingCall.fromId + '</div>');
    $('div#callLog').append('<div id="stats">Ringing...</div>');
    $('button').addClass('incall');

    //Manage the call object
      call = incomingCall;
      call.addEventListener(callListeners);
    $('button').addClass('callwaiting');

    call.answer(); //Use to test auto answer
    //call.hangup();
    }
  });

  $('#answer').click(function(event) {
    event.preventDefault();

    if($(this).hasClass("callwaiting")) {

      try {
        call.answer();
        $('button').removeClass('callwaiting');
      }
      catch(error) {
        handleError(error);
      }
    }
  });


  /*** Hang up a call ***/
  $('#hangup').click(function(event) {
    event.preventDefault();
    call && call.hangup();
  });

  $('#callButton').click(function(event) {
    call = callClient.callUser(userToCall);
    call.addEventListener(callListeners);
  });

  // This is some hacky ass code that will attempt to login in with url things,
  // if that fails, it will create a user and then attempt to login... So if
  // this sounds horrible to you (and I think it does) just turn around and go
  // back to where you came from.
  sinchClient.start({
    username: user,
    password: code
  }, function() {
    showUI();
  }, function() {
    sinchClient.newUser({
      username: user,
      password: code
    }, function() {
      //On success, start the client
      sinchClient.start(ticket, function() {
        global_username = signUpObj.username;
        //On success, show the UI
        showUI();
      });
    });
  });
});

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
