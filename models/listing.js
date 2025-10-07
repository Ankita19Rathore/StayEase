const mongoose = require('mongoose');
const Review = require('./review');   // ✅ Import Review model

//mongoose.schema baar baar na likhna pdhe isiliye usko ek varisable me store krwa liya
const Schema = mongoose.Schema;

//Creating the schema
const listingSchema = new Schema({
    title:{
        type: String,
        required: true
    },
   image: {
    filename: {
        type: String,
        default: "listingimage"
    },
    url: {
        type: String,
        required: true,
        default: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHN1bnNldCUyMGJlYWNofGVufDB8fDB8fHww",
        set: (v) => 
            v === "" 
            ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHN1bnNldCUyMGJlYWNofGVufDB8fDB8fHww"
            : v
    },
    },
    description: String,
    price: Number,
    location: String,
    country: String,

    //Making array of reviews so that This field can hold multiple objects, not just one
    reviews: [
        {
            //instead of storing the entire review object here, we only store its ID.
            type: Schema.Types.ObjectId,
           
            //when you query with .populate("reviews"), Mongoose knows:
            //Oh,these IDs belong to the Review model, let’s go fetch their details
             ref:"Review",
        },
    ],
    owner :
        {
            type: Schema.Types.ObjectId,
            ref:"User",
        },
    
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : { $in: listing.reviews} });
    }
});

//Creating the model
const Listing = mongoose.model('Listing', listingSchema);
//exporting the model
module.exports = Listing;


