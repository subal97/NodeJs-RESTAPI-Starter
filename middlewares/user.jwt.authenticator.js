const jwtService = require('../services/jwtService')
const UserModel = require('../models/UserModel');

module.exports.authenticate = async (req, res, next) =>{
    let token;
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        token = req.headers.authorization.split(" ")[1];
    }
    
    if(!token){
        InvalidTokenResponse(res);
        return;
    }

    let validationResult = await jwtService.validateJWT(token);
    if(!validationResult.success){
        InvalidTokenResponse(res);
        return;
    }
    const email = validationResult.email;
    req.user = await UserModel.findOne({Email: email});
    next();
}

function InvalidTokenResponse(res, status, message){
    res.status(403).send({
        message: 'Please provide a valid JWT'
    });
}