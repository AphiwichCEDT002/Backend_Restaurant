const Reservation = require('../models/Reservation');
const Restaurant = require('../models/Restaurant');

exports.getReservations = async (req,res,next) => {
    let query;  
    if (req.user.role !== 'admin'){
        query=Reservation.find({user:req.user.id}).populate({
            path:'restaurant',
            select: 'name address tel'
        });
    }else{
        if(req.params.restaurantId){
            query = Reservation.find({restaurant: req.params.restaurantId}).populate({
                path:'restaurant',
                select: 'name address tel'
            });
        } else {
            query=Reservation.find().populate({
                path:'restaurant',
                select: 'name address tel'
            });
        }
    }

    try {
        const reservation= await query;

        res.status(200).json({
            success:true,
            count:reservation.length,
            data:reservation
        });
    }catch (error) {
            console.log(error);
            res.status(500).json({
                success:false,
                msg:'cannot find Reservation'
            });
    }
};

exports.getReservation = async (req,res,next)=> {
    try {
        const reservation = await Reservation.findById(req.params.id).populate({
            path:'restaurant',
            select: 'name address tel'
        });
    
        if (!reservation){
            return res.status(404).json({
                success: false,
                msg:`No reservation with id of ${req.params.id}`
            });
        }

        res.status(200).json({
            success:true,
            data: reservation
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            msg:"Cannot find Reservation"
        });
    }

};

exports.addReservation = async (req,res,next) =>{
    try {

        const restaurant = await Restaurant.findById(req.params.restaurantID);

        if (!restaurant){
            return res.status(404).json({
                success : false,
                msg:`No restaurant with id ${req.params.restaurantID}`
            });
        }

        req.body.user = req.user.id;
        req.body.restaurant = restaurant;

        const existedReservations = await Reservation.find({ user: req.user.id });
        if (existedReservations.length >= 3 && req.user.role !== 'admin'){
            return res.status(400).json({
                success:false,
                msg : `User with id : ${req.user.id} has already made 3 Reservations`
            });
        }
        

        const reservationTime = req.body.reservationTime; 
        const openTime = restaurant.openTime; 
        const closeTime = restaurant.closeTime; 

        
        const timeToNumber = (timeStr) => parseInt(timeStr.replace(":", ""), 10);

        if (timeToNumber(reservationTime) < timeToNumber(openTime) || timeToNumber(reservationTime) > timeToNumber(closeTime)) {
            return res.status(400).json({
                success: false,
                msg: `Reservation time must be between ${restaurant.openTime} and ${restaurant.closeTime}`
            });
        }
        

        const reservation = await Reservation.create(req.body);
        res.status(201).json({
            success:true,
            data: reservation
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            msg:`cannot create reservation`
        });
    }

};

exports.updateReservation = async (req, res, next) => {
    try {

        let reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({
                success: false,
                msg: `No reservation found with ID: ${req.params.id}`
            });
        }

        let restaurantId = reservation.restaurant.toString();
 
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                msg: `Restaurant not found for reservation ID: ${req.params.id}`
            });
        }

        
        if (reservation.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                msg: `User with ID: ${req.user.id} is not authorized to modify this reservation`
            });
        }
        
        if (req.body.reservationTime) {
            const reservationTime = req.body.reservationTime;
            const openTime = restaurant.openTime;
            const closeTime = restaurant.closeTime;

            const timeToNumber = (timeStr) => parseInt(timeStr.replace(":", ""), 10);

            if (timeToNumber(reservationTime) < timeToNumber(openTime) || timeToNumber(reservationTime) > timeToNumber(closeTime)) {
                return res.status(400).json({
                    success: false,
                    msg: `Reservation time must be between ${restaurant.openTime} and ${restaurant.closeTime}`
                });
            }
        }

        if (req.body.reservationTime) {
            const reservationTime = req.body.reservationTime; 
            const openTime = restaurant.openTime; 
            const closeTime = restaurant.closeTime;

            const timeToNumber = (timeStr) => parseInt(timeStr.replace(":", ""), 10);

            if (timeToNumber(reservationTime) < timeToNumber(openTime) || timeToNumber(reservationTime) > timeToNumber(closeTime)) {
                return res.status(400).json({
                    success: false,
                    msg: `Reservation time must be between ${restaurant.openTime} and ${restaurant.closeTime}`
                });
            }
        }

        // Update the reservation
        reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!reservation) {
            return res.status(404).json({
                success: false,
                msg: `Reservation with ID ${req.params.id} not found`
            });
        }

        res.status(200).json({
            success: true,
            data: reservation
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: 'Cannot update reservation'
        });
    }
};

exports.deleteReservation = async (req,res,next)=>{

    
    try {
        
        const reservation = await Reservation.findById(req.params.id);

        if(!reservation){
            return res.status(201).json({
                success:false,
                msg:`No reservation with id : ${req.params.id}`
            });
        }

        if (reservation.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({
                success:false,
                msg:`User with id : ${req.user.id} has not authorize to this reservation`
                
            });
        }

         await reservation.deleteOne();

         res.status(200).json({
            success:true,
            data:{}

         });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            msg:'Cannot delete reservation'

        });
    }

};