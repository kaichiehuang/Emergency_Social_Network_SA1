const UserSocket = require('../model/usersocket');
const User = require('../model/user');


class ChatMessageController {


  /**
   * Set the user field "onLine"
   * @param req
   * @param res
   */
   connectUser(req,res){
     let usetModel = new User();
     let userId = req.params.userId;
     let onLine = req.body.onLine;
     usetModel.updateOnLineStatus(userId,onLine).then(usr => {
        res.contentType('application/json');
        return res.status(201).send("User connected");
      }).catch(err => {
        return res.status(500).send(err);
      });

   }



  sendMessage(req,res){
    let message = req.body.message;
     res.io.emit('send message', message);
  }

}

module.exports = ChatMessageController;
