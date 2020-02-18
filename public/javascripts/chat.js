$(function() {

  const socket = io('http://localhost:3000');
  socket.on("new-chat-message", data =>{
    alert(data.message);
  });


  setOnline(true);
  getUsers();

  $(window).on('unload', function(){
    setOnline(false);
  });

  /****** events declaration ********/
  $('#send-message-button').click(function(e) {
      sendMessage();
  });


});



function getUsers(){

  let jwt  = Cookies.get('user-jwt-esn');
  $.ajax({
    url: apiPath + '/users',
    type: 'get',
    headers: {"Authorization": jwt}
  }).done(function(response) {
    console.log(response);
  }).fail(function(e) {
    $("#signup-error-alert").html(e);
    $("#signup-error-alert").show();
  }).always(function() {
    console.log("complete");
  });
}



function setOnline(status){

  let user_id = Cookies.get('user-id');
  let jwt  = Cookies.get('user-jwt-esn');
  let acknowledgement = Cookies.get('user-acknowledgement');

  $.ajax({
    url: apiPath + '/users/' + user_id,
    type: 'put',
    data: {
      'onLine': status,
      'acknowledgement':acknowledgement
    },
    headers: {"Authorization": jwt}
  }).done(function(response) {
    console.log(response);
  }).fail(function(e) {
    $("#signup-error-alert").html(e);
    $("#signup-error-alert").show();
  }).always(function() {
    console.log("complete");
  });
}


function sendMessage(){
  let user_id = Cookies.get('user-id');
  let jwt  = Cookies.get('user-jwt-esn');
  $.ajax({
    url: apiPath + '/chat-messages',
    type: 'post',
    data: {
      'message': 'msg',
      "user_id": user_id
    },
    headers: {"Authorization": jwt}
  }).done(function(response) {
    console.log(response);
  }).fail(function(e) {
    $("#signup-error-alert").html(e);
    $("#signup-error-alert").show();
    alert(e);
  }).always(function() {
    console.log("complete");
  });
}
