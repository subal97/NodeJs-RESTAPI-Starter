const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const jwt_key = process.env.JWT_SECRET;
const jwt_expiry = process.env.JWT_EXPIRY || "1h";

const jwtOptions = {
    expiresIn: jwt_expiry
}

module.exports.createJWT = function(user){
    let claims = {
        sub: user.Email,
    }
    let token = jwt.sign(claims, jwt_key, jwtOptions);
    return token;
}

module.exports.validateJWT = async function(token){
    let decoded;
    try {
        decoded = await promisify(jwt.verify)(token, jwt_key);
    } catch (error) {
        return {success: false, error: error}
    }
    return {success: true, email: decoded.sub};
}