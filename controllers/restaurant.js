const Reservation = require('../models/Reservation');
const Restaurant = require('../models/Restaurant');



exports.getRestaurants = async (req,res,next) =>{
        let query;
        const reqQuery = {...req.query};
        const removeFields = ['select','sort','page','limit'];

        removeFields.forEach(param=>delete reqQuery[param])
        console.log(reqQuery);

        let queryStr = JSON.stringify(reqQuery);

        queryStr = queryStr.replace(/\b(gt,gte,lt,lte,in)\b/g, match=>`$${match}`);

        query = Restaurant.find(JSON.parse(queryStr)).populate('reservation');

        if (req.query.select){
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }else{
            query = query.sort('-createAt');
        }

        const page = parseInt(req.query.page,10)|| 1;

        const limit = parseInt(req.query.limit,10)||25;

        const startIndex = (page-1)*limit;
        const endIndex = page*limit;
        const total = await Restaurant.countDocuments();
        query = query.skip(startIndex).limit(limit);

        const pagination = {};

        if (endIndex < total){
            pagination.next = {
                page:page+1,
                limit
            }
        }

        if (startIndex > 0){
            pagination.prev = {
                page:page-1,
                limit
            }
        }

    try {

    const restaurants = await query; 
    res.status(200).json({
        success:true, 
        count:restaurants.length,
        data : restaurants
    });
    
    } catch (error) {
        console.log(error);
        res.status(400).json({success:false});
    }
    
};

exports.getRestaurant = async (req,res,next) =>{
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            console.log(error);
            res.status(400).json({success:false});
        }
            

        res.status(200).json({success:true,data: restaurant});
    } catch (error) {
        console.log(error);
        res.status(400).json({success:false});
    }
    
};

exports.createRestaurant = async (req,res,next) =>{
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json({success:true,data:restaurant});
    
    
};

exports.updateRestaurant = async (req,res,next) =>{

    try {
        const restaurant = await Restaurant.findByIdAndUpdate(req.params.id,req.body,{
            new : true,
            runValidators: true
        });

        if (!restaurant) res.status(400).json({success:false});

        res.status(200).json({success:true,data:restaurant});

    } catch (error) {
        res.status(400).json({success:false});
    }


    
    
};

exports.deleteRestaurant = async (req,res,next) =>{

    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({
                success:false,
                msg:`cannot find restaurant with id ${req.params.id}`
            });
        }

        await Reservation.deleteMany({restaurant:req.params.id});
        await Restaurant.deleteOne({_id:req.params.id});
        res.status(200).json({success:true,data:{}});

    } catch (error) {
        res.status(400).json({success:false});
    }
    
};







/*
//getall lt gt or etc
exports.getRestaurants = async (req,res,next) =>{
        let query;
        let queryStr=JSON.stringify(req.query);
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/
            , match=> `$${match}`
        );
        query = Restaurant.find(JSON.parse(queryStr));
    try {

    const restaurants = await query; 
    res.status(200).json({
        success:true, 
        count:restaurants.length, 
        data : restaurants
    });
    
    } catch (error) {
        res.status(400).json({success:false});
    }
    
};

//sort and select fields getall

exports.getRestaurants = async (req,res,next) =>{
        let query;
        const reqQuery = {...req.query};
        const removeFields = ['select','sort'];

        removeFields.forEach(param=>delete reqQuery[param])
        console.log(reqQuery);

        let queryStr = JSON.stringify(reqQuery);

        queryStr = queryStr.replace(/\b(gt,gte,lt,lte,in)\b/g, match=>`$${match}`);

        query = Restaurant.find(JSON.parse(queryStr));

        if (req.query.select){
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }else{
            query = query.sort('-createAt');
        }

    try {

    const restaurants = await query; 
    res.status(200).json({
        success:true, 
        count:restaurants.length, 
        data : restaurants
    });
    
    } catch (error) {
        res.status(400).json({success:false});
    }
    
};

*/