const mongoose=require('mongoose');
const initData =require('./data.js');
const Listing = require('../models/listing.js');

//Database connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

//Calling the main function
main()
    .then(() =>{
        console.log("Database Initialized");
    })
    .catch((err) => {
        console.log(err);
    });

async function main(){
    await mongoose.connect(MONGO_URL);//node se mongo ko connect krega
}

const initDB = async() => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj ,
         owner : "68e12093ba587fa3cbdc2b6f"
        })); // Replace with a valid User ID from your database
    await Listing.insertMany(initData.data);
    console.log("Database Initialized with sample data");
}

initDB();
