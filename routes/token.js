const express = require("express");
const router = express.Router();

const {generateToken,verifyToken} = require  ("../middleware/tokenServer");



router.post("/", function (req,res, next){

    let token = req.header("Authorization");
    //TODO get userID
    let user =1;

    if(token){
        //verify token
        verifyToken(token)
            .then( _ => {

                generateToken(user)
                    .then(generatedToken =>{
                        res.header('Authorization','BEARER ' + generatedToken );
                        res.send(generatedToken);
                    });
            })
            .catch(err => {
                console.log("error en verify: " + err);
                res.status(401).send(err.message);//UNAUTHORIZED
            });

    }else{
        //not token provided
        res.status(403).end(); //FORBIDDEN

    }
});


module.exports = router;
