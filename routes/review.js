const express =require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync =require("../utils/wrapAsync.js");
const ExpressError =require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing=require('../models/listing.js');
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");




//Reviews
//Post  review route
router.post(
    "/",
    isLoggedIn,
    validateReview ,
    wrapAsync(async(req,res)=>{
        let listing= await Listing.findById(req.params.id);
        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        listing.reviews.push(newReview);
        console.log(newReview);

        //db me save krwa denege inko aur existing doc me kuch changes krne ho kuch save krna ho then we always use this
        await newReview.save();
        await listing.save()
        ;
        req.flash("success","New review Created Successfully!!");

        res.redirect(`/listings/${listing._id}`);

        // console.log("New review saved");
        // res.send("new review saved");
    })
);

//Delete review route
router.delete(
    "/:reviewId" ,
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(async(req,res)=>{
        let {id , reviewId}=req.params;
        //aray ke andr delete krne ke liye 
        await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});//reviews array ke andr jo bhi review id se match krega use hum yha se pull krre
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","New review Deleted Successfully!!");

        res.redirect(`/listings/${id}`);

  })
);

module.exports = router;

