const jwt = require('jsonwebtoken');


const validateTokenMid = async (req, res, next) =>{

    let token = req.header("Authorization");

    if(token) {
        //verify token
        let verify = await verifyToken(token);
        if(verify){
            next();
        }else{
            return res.status(401).send(verify);//UNAUTHORIZED
        }
    }

    return res.status(401).send("NOT TOKEN PROVIDED"); //UNAUTHORIZED

};

const generateToken = async (user) =>{
    let jwt = req.ijwt;

    //look for user in database
    let userId = 1;

    let generatedToken = jwt.sign({
            data: userId//change for the user id
        },
        "sectet_string",
        { expiresIn: 30}
    );

    return generatedToken;
};





const verifyToken = async (token) =>{
        //verify token
        jwt.verify(token, "sectet_string", function (err, decoded) {
            if (err) {
                return err; //UNAUTHORIZED
            }

            var userId = decoded.data;
            //look for user in database
            // if (userIdVal) {
            //     return true;
            // }

            return true; //AUTHORIZED
        });
};



module.exports = {
    validateTokenMid,
    generateToken,
    verifyToken
};
