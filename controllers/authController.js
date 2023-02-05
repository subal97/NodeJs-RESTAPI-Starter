const UserModel = require('../models/UserModel');
const AppError = require('../utils/appError')
const jwtService = require('../services/jwtService');

exports.login = async (req, res, next) => {
    const {Email, Password} = req.body;
    if(!Email || !Password){        
        res.status(400).json({
            status:'fail',
            message: 'Please provide email/password'
        });
    }
    
    //check password
    const user = await UserModel.findOne({Email: Email});
    if(!user || !(await user.checkPassword(Password, user.Password))){
        res.status(400).json({
            status:'fail',
            message: 'Invalid Username/Password'
        });
    }

    let token = jwtService.createJWT(user);

    res.status(200).json({
        status: 'success',
        token: token,
        message:"Welcome to nodejs starter API"
    })
    
};

exports.signup = async(req, res, next) =>{
    try {
        const user = await UserModel.create({
            Email: req.body.Email,
            Password: req.body.Password,
            Roles:['user']
        });
        
        user.Password = undefined;
        let token = jwtService.createJWT(user);
        res.status(201).json({
            status:'success',
            token: token,
            message:'User created. Welcome to nodejs starter API'
        })

    } catch (error) {
        if(error.code && error.code === 11000){
            res.status(422).json({
                status: 'fail',
                message:'User already exists'
            })
        }
        next(error);
    }
};