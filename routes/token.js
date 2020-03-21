// const express = require("express");
// const router = express.Router();
// const TokenServerClass = require("../middleware/tokenServerClass")
//
// router.post("/", function (req,res, next){
//
//     let token = req.header("Authorization");
//     //TODO get userID
//     let user =1;
//
//     if(token){
//         //verify token
//         TokenServerClass.verifyToken(token)
//             .then( _ => {
//                 TokenServerClass.generateToken(user,false)
//                     .then(generatedToken =>{
//                         res.header('Authorization','BEARER ' + generatedToken );
//                         res.send(generatedToken);
//                     });
//             })
//             .catch(err => {
//                 res.status(401).send(verify.message);//UNAUTHORIZED
//             });
//
//     }else{
//         //not token provided
//         res.status(403).end(); //FORBIDDEN
//
//     }
// });
//
//
// module.exports = router;
