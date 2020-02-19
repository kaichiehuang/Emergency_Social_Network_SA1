$(function() {

  const socket = io('http://localhost:3000');
  socket.on("new-chat-message", data =>{
    drawMessageItem(data);
  });


  setOnline(true);

  //TODO UI of the messsages previously sended with the information returned in the next method
  getMessages();

  $(window).on('unload', function(){
    setOnline(false);
  });

  /****** events declaration ********/
  $('#send-btn').click(function(e) {
      sendMessage();
  });


});

function drawMessageItem(data) {
  let list_length = $('ul#chat li').length;
  let new_li = $('ul#chat li#template').clone();
  let class_ori = new_li.attr("class");
  class_ori = class_ori.replace(' hide', '');
  if (list_length % 2 == 1) {
    new_li.attr("class", class_ori + ' user-post-odd');
  } else {
    new_li.attr("class", class_ori + ' user-post-even');
  }
  let user_id = Cookies.get('user-id');
  if (user_id === data.user_id._id) {
    new_li.attr("class", new_li.attr("class") + ' user-post-current');
  }
  new_li.removeAttr('id');
  let child = new_li.html();
  let child_new = child.replace('%username_token%', data.user_id.username)
      .replace('%timestamp_token%', new Date(data.created_at).toLocaleString())
      .replace('%message_token%', data.message);
  new_li.html(child_new);
  $('#chat').append(new_li);
}




/**
 * Updates de status online of the user
 * @param status
 */
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


/**
 * Sends and saves the message the user post.
 */
function sendMessage(){
  let user_id = Cookies.get('user-id');
  let jwt  = Cookies.get('user-jwt-esn');
  $.ajax({
    url: apiPath + '/chat-messages',
    type: 'post',
    data: {
      'message': $("#send-message-content").val(),
      "user_id": user_id
    },
    headers: {"Authorization": jwt}
  }).done(function(response) {
    $("#send-message-content").val("");
    console.log(response);
  }).fail(function(e) {
    $("#signup-error-alert").html(e);
    $("#signup-error-alert").show();
    alert(e);
  }).always(function() {
    console.log("complete");
  });
}


/**
 * Get all the messages prevoisly posted
 * (messages saved on the db)
 */
function getMessages(){
  let jwt  = Cookies.get('user-jwt-esn');
  $.ajax({
    url: apiPath + '/chat-messages',
    type: 'get',
    headers: {"Authorization": jwt}
  }).done(function(response) {
    //console.log(response);
    response.forEach(element => {
      drawMessageItem(element);
    });
  }).fail(function(e) {
    $("#signup-error-alert").html(e);
    $("#signup-error-alert").show();
    alert(e);
  }).always(function() {
    console.log("complete");
  });
}