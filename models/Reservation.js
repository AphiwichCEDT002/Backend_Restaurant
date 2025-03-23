const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({

    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    restaurant:{
        type:mongoose.Schema.ObjectId,
        ref:'Restaurant',
        required:true
    },
    reservationDate : {
        type:String,
        required : [true,'Please input Day that you reserve']
    },
    reservationTime :{
        type:String,    
        required:[true,'Please add Your Reservation time'],
    },
    createdAt:{
        type: Date,
        default : Date.now
    }

});

module.exports = mongoose.model('Reservation',ReservationSchema);