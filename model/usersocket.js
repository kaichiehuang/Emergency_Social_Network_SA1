const UserSocketModel = require('./model').UserSocketMongo;


class UserSocket {

  constructor(user_id, socket_id) {
    this.user_id = user_id;
    this.socket_id = socket_id;
  }

  createUserSocket(){
    let userSocket = new UserSocketModel({
      user_id: this.user_id,
      socket_id:thos.socket_id
    });

    return userSocket.save();
  }


  findSocketByUser(username){
    return new Promise((resolve, reject) => {
      console.log(username);
      UserSocketModel.findOne({
        user_id: user_id
      }).exec().then(userSocket => {
        resolve(userSocket);
      }).catch(err => {
        reject(err);
      });
    });
   }

  /**
   * Get the List of Sockets Id's
   *  by the User Name
   * @param username
   * @returns {Promise<unknown>}
   */
  findSocketsByUser(username){
    return new Promise((resolve, reject) => {
      console.log(username);
      UserSocketModel.find({
        user_id: user_id
      }).exec().then(userSocket => {
        resolve(userSocket);
      }).catch(err => {
        reject(err);
      });
    });
  }


  /**
   * Delete all the socket ids of the
   * user send in the parameter.
   * @param username
   * @returns {Promise<unknown>}
   */
  findBySocketAndDelete(socket_id){
    return new Promise((resolve, reject) => {
      console.log(username);
      UserSocketModel.deleteMany({
        socketId: socket_id
      }).exec().then(userSocket => {
        resolve(userSocket);
      }).catch(err => {
        reject(err);
      });
    });
  }



}
