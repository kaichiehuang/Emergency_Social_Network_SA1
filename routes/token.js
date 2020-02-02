const express = require("express");
const router = express.Router();
const token = require("token")

router.get("/", function(res,req, next){

    var jwt = req.ijwt;
    var token = req.header("Authorization");

    if(token){
        //verify token
        jwt.verify(token, "sectet_string", function (err, decoded) {
            if (err) {
                if(err.name !== 'TokenExpiredError') {
                    return res.status(401).send(err.message); //UNAUTHORIZED
                }
            }

            var token = jwt.sign({
                    data: 1 //change for the user id
                },
                "sectet_string",
                { expiresIn: 30}
            );

            res.header('Authorization','BEARER ' + token );
            res.send(token);
        });

    }else{
        //not token provided
        return res.status(403).end(); //FORBIDDEN

    }
})