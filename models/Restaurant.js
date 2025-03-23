const mongoose = require('mongoose');
 

const RestaurantSchema = new mongoose.Schema({

    name : {
        type : String,
        required : [true,'Please add name'],
        unique : true,
        trim : true,
        maxLength : [50,'Name cannot be more than 50 char']
    },
    address :{
        type : String,
        required : [true,'please add address'],
    },
    tel : {
        type : String,
        unique: [true,'please add telephone number']
    },
    openTime: {
        type: String, 
        required: [true, 'Please add opening time']
    },
    closeTime: {
        type: String,
        required: [true, 'Please add closing time']
    },
    picture : {
        type : String
    }
},{
    toJSON: {virtuals:true},
    toObject:{virtuals:true}
});

RestaurantSchema.virtual('reservation',{
    ref:'Reservation',
    localField:'_id',
    foreignField:'restaurant',
    justOne:false

});

module.exports = mongoose.model('Restaurant', RestaurantSchema);