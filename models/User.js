const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,'please add name']
    },
    email :{
        type : String,
        requireก : [true,'please add email'],
        unique: true,
        match : [/^[^\s@]+@[^\s@]+\.[^\s@]+$/]
    },
    tel:{
        type: String,
        unique:true
    },
    role : {
        type : String,
        enum : ['user','admin'],
        default : 'user'
    },
    password :{
        type : String,
        required : [true,'please add password'],
        minlength : 6,
        select:false
    },
    resetPasswordToken: String,
    resetPasswordExpire : Date,
    createAt :{
        type : Date,
        default : Date.now
    }

});



UserSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);

});

UserSchema.methods.getSignedJwtToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE
    });
};

UserSchema.methods.matchPassword = async function(enteredPassword){

    return await bcrypt.compare(enteredPassword,this.password);

};


module.exports = mongoose.model('User',UserSchema);