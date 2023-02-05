const jwtService = require('../services/jwtService')
const UserModel = require('../models/UserModel');

module.exports.validateAdminRole = async (req, res, next) =>{ 
    const roles = req.user.Roles;
    if(!roles.includes('admin')){
        ErrorResponse(res, 405, 'Operation is not allowed for this user')
        return;
    }
    next();
}

function ErrorResponse(res, status, message){
    res.status(status).send({
        message: message
    });
}