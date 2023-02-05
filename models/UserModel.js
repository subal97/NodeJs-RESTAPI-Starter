const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

let UserSchema = new Schema({
    Email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "Please fill your email"],
        validate: [validator.isEmail, "Please provide a valid email"]
    },
    Password:{
        type: String,
        required: [true, "Please provide a password"],
        minLength: 6
    },
    Roles:{
        type: [String],
    }
});

UserSchema.pre('save', async function(next){
    if(!this.isModified('Password')){
        return next();
    }

    this.Password = await bcrypt.hash(this.Password, 12);
    next();
});

UserSchema.methods.checkPassword = async function(typedPass, originalPass){
    return bcrypt.compare(typedPass, originalPass);
};


module.exports = mongoose.model("User", UserSchema);