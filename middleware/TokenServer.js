const jwt = require('jsonwebtoken');
const EXP_TOKEN_TIME = 3000;
const EXP_REFRESH_TOKEN_TIME = '10h';
const SECRET_STRING = '45A1DD09A2B6298130DB7A922CDED94EE7675072B3823063378D6CE8D8B01598';

/**
 * token service provider
 */
class TokenServer {
    /**
     * verify token
     * @param token
     * @returns {Promise<unknown>}
     */
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

    /**
     * validate token
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    static validateToken(req, res, next) {
        console.log('validateTokenMid');
        console.log(Object.keys(req.route.methods)[0]);
        const token = req.header('Authorization');
        if (token) {
            TokenServer.verifyToken(token)
                .then((userId) => {
                    req.tokenUserId = userId.data;
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

    /**
     * generate token
     * @param userId
     * @param refreshToken
     * @returns {Promise<unknown>}
     */
    static generateToken(userId, refreshToken) {
        return new Promise((resolve, reject) => {
            let expTime;

            if (refreshToken) {
                console.log('Generete normal token');
                expTime = EXP_TOKEN_TIME;
            } else {
                console.log('Generete refresh token');
                expTime = EXP_REFRESH_TOKEN_TIME;
            }
            const generatedToken = jwt.sign({
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
