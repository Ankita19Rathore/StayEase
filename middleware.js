const Listing= require("./models/listing");
const ExpressError =require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirectURL
    //console.log(req.path,"..",req.originalUrl);
    //req obj ke andr session obj hota usme ek paramatere create krenge which is redirectUrl
    //jo ki req.originalUrl ke barabar hoga
    //originalUrl me pura url hota hai jo user ne request kiya hota hai
    //ye redirectUrl hum login krne ke baad use krenge jaha se wo aya tha waha bhejne keliye
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be signed in first!!");
        return res.redirect("/login");
    }   
    next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    //agr req me kuch save hua hai to use res.locals me save kra lenge
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You do not have permission to do that ");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req,res,next)=>{
       
             let {error} = listingSchema.validate(req.body);
              
              if(error){
                let errMsg = error.details.map((el) => el.message).join(",");
                throw new ExpressError(400,errMsg);
              }else{
                next();
              }
        };

module.exports.validateReview = (req,res,next)=>{
   
         let {error} = reviewSchema.validate(req.body);
          
          if(error){
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400,errMsg);
          }else{
            next();
          }
    };

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review ");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
