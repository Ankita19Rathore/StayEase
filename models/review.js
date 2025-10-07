const mongoose = require('mongoose');

//mongoose.schema baar baar na likhna pdhe isiliye usko ek varisable me store krwa liya
const Schema = mongoose.Schema;

const reviewSchema=new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default: Date.now()
    },
    author:{
        type: Schema.Types.ObjectId,
        ref:"User",//refering to user model
    }
});

module.exports=mongoose.model("Review", reviewSchema);