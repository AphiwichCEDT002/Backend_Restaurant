const User = require('../models/User');

exports.register = async (req,res,next)=>{
    try {
        
        const {name,email,tel,password,} = req.body;

        const user = await User.create({
            name,
            email,
            password,
            tel,
            role:'user'

        });

        // const token = user.getSignedJwtToken();
        // res.status(200).json({success:true,token});
        sendTokenResponse(user,200,res);

    } catch (error) {
        res.status(400).json({success:false,msg:error.errmsg});
    }

    
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if both fields are provided
        if (!email || !password) {
            return res.status(400).json({ success: false, msg: "Please input your email and password" });
        }

        // Fetch user and include password
        const user = await User.findOne({ email }).select('+password');

        // Check if user exists
        if (!user) {
            return res.status(401).json({ success: false, msg: "Invalid email or password" });
        }

        // Match password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, msg: "Invalid email or password" });
        }

        // const token = user.getSignedJwtToken();
        // res.status(200).json({success:true,token});
        sendTokenResponse(user,200,res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: "Server error" });
    }
};

exports.logout = (req,res,next)=>{

    try {
        res.cookie('token','none',{
            expires: new Date(Date.now()+10*1000),
            httpOnly:true
        });

        res.status(200).json({
            success: true,
            msg: `Logout successfull!!!!!`
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            msg:'Cannot logout'
        });
    }


};

const sendTokenResponse = (user,statusCode,res)=>{

    const token = user.getSignedJwtToken();
        // res.status(200).json({success:true,token});
    const options = {
        expireAt : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        httpOnly : true
    };

    if(process.env.NODE_ENV === "production"){
        options.secure = true;
    }

    res.status(statusCode).cookie('token',token,options).json({
        success :true,
        token

    });

};

exports.getMe = async (req,res,next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        data:user

    });
};