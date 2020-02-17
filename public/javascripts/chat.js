$(function() {

  const socket = io('http://localhost:3000');
  socket.on("send message", data =>{
    alert(data);
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


  $('#logout-button').click(function(e) {
    setOnline(false);
  });

});



function getUsers(){

  let jwt  = Cookies.get('user-jwt-esn');
  $.ajax({
    url: apiPath + '/users/users',
    type: 'get',
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



function setOnline(status){

  let user_id = Cookies.get('user-id');
  let jwt  = Cookies.get('user-jwt-esn');
  $.ajax({
    url: apiPath + '/chat/' + user_id,
    type: 'put',
    data: {
      'onLine': status
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


function sendMessage(){
  let msg = "Hi, this is a test";
  let jwt  = Cookies.get('user-jwt-esn');
  $.ajax({
    url: apiPath + '/chat/message',
    type: 'post',
    data: {
      'message': msg
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
