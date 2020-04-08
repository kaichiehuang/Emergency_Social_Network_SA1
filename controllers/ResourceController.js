const Resource = require('../model/resource')
const User = require('../model/user.js');
const ChatMessage = require('../model/chatMessage.js');

class ResourceController{

    /**
     * Method to create a resource
     * @param req
     * @param res
     */
    registerResource(req,res){
        console.log("in register resource")
        console.log(req.file );
        console.log(JSON.parse(req.body.data));
        const requestData = JSON.parse(req.body.data);
        console.log(requestData.user_id);
        //Getting the parameters from request body
        const user_id = requestData.user_id;
        const resourceType = requestData['resourceType'];
        const name = requestData['name'];
        const location = requestData['location'];
        const description = requestData['description'];
        const questionOne = requestData['questionOne'];
        const questionTwo = requestData['questionTwo'];
        const questionThree = requestData['questionThree'];
        const image = requestData['image'];
        const contentType = requestData['contentType'];

        console.log('questionOne:'+ questionOne);
        console.log('questionTwo:'+ questionTwo);

        const resource = new Resource(user_id,resourceType,name,location,
            description,questionOne,questionTwo,questionThree,req.file.buffer,req.file.mimetype)

        resource.saveResource()
            .then((newResource =>{
                console.log('ResourceController registerResource:'
                    + newResource);
                User.findUserById(user_id)
                    .then((userFound)=>{
                        console.log('userfind'+userFound)
                        //Create Message on the public Chat
                        // 2. Create chat message object
                        const chatMessage = new ChatMessage('Resource Shared:' + name,
                            userFound._id, userFound.status);
                        // 3. save chat message
                        chatMessage.createNewMessage()
                            .then((chatMessageCreated)=>{
                                // 4. if chat message was saved emit the chat message to everyone
                                res.io.emit('new-chat-message', {
                                    'id': chatMessageCreated._id,
                                    'message': chatMessageCreated.message,
                                    'user_id': {
                                        '_id': userFound._id,
                                        'username': userFound.username
                                    },
                                    'created_at': chatMessageCreated.created_at,
                                    'status': chatMessageCreated.status
                                });



                                res.contentType('application/json');
                                res.status(201).send(JSON.stringify(newResource));
                            })
                    })


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
    getResource(req,res){
        const resourceId = req.params.resourceId;

        //Get resource by ID
        if(resourceId !== undefined){
            Resource.findResourceById(resourceId)
                .then(resource =>{
                    console.log('ResourceController findResourceById:'
                        + resource);
                    res.contentType('application/json');
                    return res.status(201).send(JSON.stringify(resource));
                })
                .catch((err) => {
                    return res.status(422).send(JSON.stringify({
                    'error': err.message
                }));
            });
        }else{
            //Get all resources
            Resource.findResources()
                .then(resources =>{
                    console.log('ResourceController findResources:'
                        + resources);
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

module.exports = ResourceController
