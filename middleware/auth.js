const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req,res,next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token){
        return res.status(400).json({success:false,msg: 'your role not have permission'});
    }
    
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        console.log(decoded);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        console.log(error.stack);
        res.status(400).json({success:false,msg:'not authorize to access this route'});
    }

};

exports.authorize =(...role)=>{
    return (req,res,next)=>{
        if (!role.includes(req.user.role)){
            return res.status(403).json({success: false, msg :`User role ${req.user.role} cannot access this part`});
        }

        next();
    }

};