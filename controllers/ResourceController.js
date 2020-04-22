const Resource = require('../model/resource');
const User = require('../model/user.js');
const ChatMessage = require('../model/chatMessage.js');
const SocketIO = require('../utils/SocketIO.js');

/**
 * resource controller
 */
class ResourceController {
    /**
     * Method to create a resource
     * @param req
     * @param res
     */
    registerResource(req, res) {
        console.log('in register resource');
        console.log(req.body );
        console.log(req.file );
        // console.log(JSON.parse(req.body));
        const requestData = req.body;
        console.log(requestData.user_id);
        // Getting the parameters from request body
        const userId = requestData.user_id;
        const resourceType = requestData['resourceType'];
        const name = requestData['name'];
        const location = requestData['location'];
        const description = requestData['description'];
        const questionOne = requestData['questionOne'];
        const questionTwo = requestData['questionTwo'];
        const questionThree = requestData['questionThree'];

        console.log('questionOne:'+ questionOne);
        console.log('questionTwo:'+ questionTwo);


        let file;
        let fileType;
        if (req.file === undefined) {
            file = '';
            fileType='';
        } else {
            file =req.file.buffer;
            fileType = req.file.mimetype;
        }

        const resource = new Resource(userId, resourceType, name, location,
            description, questionOne, questionTwo, questionThree, file, fileType);

        resource.saveResource()
            .then(((newResource) =>{
                User.findUserById(userId)
                    .then((userFound)=>{
                        // Create Message on the public Chat
                        // 2. Create chat message object
                        const chatMessage = new ChatMessage('Resource Shared:' + name,
                            userFound._id, userFound.status);
                        // 3. save chat message
                        chatMessage.createNewMessage()
                            .then((chatMessageCreated)=>{
                                const message = {
                                    'id': chatMessageCreated._id,
                                    'message': chatMessageCreated.message,
                                    'user_id': {
                                        '_id': userFound._id,
                                        'username': userFound.username
                                    },
                                    'created_at': chatMessageCreated.created_at,
                                    'status': chatMessageCreated.status
                                };
                                // 4. if chat message was saved emit the chat message to everyone
                                const socketIO = new SocketIO(res.io);
                                socketIO.emitMessage('new-chat-message', message);

                                res.contentType('application/json');
                                res.status(201).send(JSON.stringify(newResource));
                            });
                    });
            })).catch((err) => {
                return res.status(422).send(JSON.stringify({
                    'error': err.message
                }));
            });
    }


    /**
     * Method to get resources, by Id or all the resources
     * @param req
     * @param res
     */
    getResource(req, res) {
        const resourceId = req.params.resourceId;

        // Get resource by ID
        if (resourceId !== undefined) {
            Resource.findResourceById(resourceId)
                .then((resource) =>{
                    res.contentType('application/json');
                    return res.status(201).send(JSON.stringify(resource));
                })
                .catch((err) => {
                    return res.status(422).send(JSON.stringify({
                        'error': err.message
                    }));
                });
        } else {
            // Get all resources
            Resource.findResources()
                .then((resources) =>{
                    res.contentType('application/json');
                    return res.status(201).send(JSON.stringify(resources));
                })
                .catch((err) => {
                    return res.status(422).send(JSON.stringify({
                        'error': err.message
                    }));
                });
        }
    }
}

module.exports = ResourceController;
