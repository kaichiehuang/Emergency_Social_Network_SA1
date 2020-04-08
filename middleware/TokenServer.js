const jwt = require('jsonwebtoken');
const EXP_TOKEN_TIME = 3000;
const EXP_REFRESH_TOKEN_TIME = '10h';
const SECRET_STRING = '45A1DD09A2B6298130DB7A922CDED94EE7675072B3823063378D6CE8D8B01598';


class TokenServer {
    static verifyToken(token) {
        return new Promise((resolve, rejected) => {
            try {
                const payload = jwt.verify(token, SECRET_STRING);
                resolve(payload);
            } catch (e) {
                /* istanbul ignore next */
                rejected(e);
            }
        });
    }

    static validateToken(req, res, next) {
        console.log('validateTokenMid');
        const token = req.header('Authorization');
        if (token) {
            TokenServer.verifyToken(token)
                .then((userId) => {
                    console.log('userId: ' + userId.data);
                    next();
                })
                .catch((err) => {
                    /* istanbul ignore next */
                    console.log('error en verify: ' + err);
                    return res.status(401).send(err.message).end();// UNAUTHORIZED
                });
        } else {
            /* istanbul ignore next */
            console.log('before (next) no token provided');
            return res.status(401).send('NOT TOKEN PROVIDED').end(); // UNAUTHORIZED
        }
    }


    static generateToken(userId, refreshToken) {
        return new Promise((resolve, reject) => {
            let generatedToken;
            let expTime;

            if (refreshToken) {
                console.log('Generete normal token');
                expTime = EXP_TOKEN_TIME;
            } else {
                console.log('Generete refresh token');
                expTime = EXP_REFRESH_TOKEN_TIME;
            }
            generatedToken = jwt.sign({
                data: userId// change for the user id
            },
            SECRET_STRING,
            {expiresIn: expTime}
            );

            resolve(generatedToken);
        });
    }

    // static removeToken(token) {
    //     return new Promise((resolve, rejected) => {
    //         this.verifyToken(token)
    //             .then((payload) => {
    //                 this.verifyUser(payload)
    //                     .then((verify) => {
    //                         console.log('verify: ' + verify);
    //                         resolve(verify);
    //                     })
    //                     .catch((err) => {
    //                         console.log('error en verifyUser: ' + err);
    //                         return res.status(401).send(err.message).end();// UNAUTHORIZED
    //                     });
    //             });
    //     });
    // }
}
module.exports = TokenServer;
