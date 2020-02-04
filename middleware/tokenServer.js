const jwt = require('jsonwebtoken');
const SECRET_STRING = '45A1DD09A2B6298130DB7A922CDED94EE7675072B3823063378D6CE8D8B01598';

const validateTokenMid = function (req, res, next){
    console.log("validateTokenMid");
    let token = req.header("Authorization");
    if(token) {




        verifyToken(token)
            .then( verify => {
                console.log("verify: " + verify);
                next();
            })
            .catch(err => {
                console.log("error en verify: " + err);
                return res.status(401).send(err.message).end();//UNAUTHORIZED
            });


    }else{
        console.log("before (next) no token provided");
        //next("NOT TOKEN PROVIDED");
        return  res.status(401).send("NOT TOKEN PROVIDED").end(); //UNAUTHORIZED

    }


};


const generateToken = userId =>{

    return new Promise((resolve, reject)=>{
        let generatedToken = jwt.sign({
                data: userId//change for the user id
            },
            SECRET_STRING,
            { expiresIn: 3000}
        );

        resolve(generatedToken);
    });

};




const verifyToken = token =>{

    return new Promise((resolve, rejected)=>{
        try {
            let payload = jwt.verify(token, SECRET_STRING);
            console.log("payload:" + payload.data);
            resolve(true);
        }catch (e) {
            console.log("error:" + e);
            rejected(e);
        }
    });

};



module.exports = {
    validateTokenMid,
    generateToken,
    verifyToken
};
