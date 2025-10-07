const express =require("express");
const router = express.Router();
const wrapAsync =require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing = require("../models/listing.js");

const { isLoggedIn,isOwner, validateListing } = require("../middleware.js");



//Index route
router.get(
    "/",
    wrapAsync(async(req,res)=> {
        const allListings =  await Listing.find({});
        res.render("listings/index.ejs",{allListings});
    })
);

//new route
router.get(
    "/new",isLoggedIn,(req,res)=>{
       
        //agr user authenticate ni hai to use login page pe bhej dena hai
       
        res.render("listings/new.ejs");

});


//Show route
router.get(
    "/:id",
    wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing
                       .findById(id)
                       .populate({path :"reviews", 
                          populate : {path : "author"},
                       })
                       .populate("owner");
    if(!listing){
        req.flash("error","Cannot find that listing!!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing,currUser:req.user});//
}));

//Create route
router.post(
    "/", 
    isLoggedIn,
    validateListing,
    wrapAsync(async(req,res,next)=>{
      
      const newListing= new Listing(req.body.listing);
      //console.log(req.user);
      newListing.owner=req.user._id;
    // if(!newListing.title){
    //     throw new ExpressError(400,"Title is missing");

    // }
    //  if(!newListing.description){
    //     throw new ExpressError(400,"Description is missing");

    // }
    //  if(!newListing.location){
    //     throw new ExpressError(400,"Location is missing");

    // }
    
   
        //let listing = req.body.listing;

        await newListing.save();
        req.flash("success","Successfully made a new listing");
        res.redirect("/listings");
        //console.log(newListing);

    
}));

//Edit route
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(async(req,res)=> {
        const {id} = req.params;
        const listing = await Listing.findById(id);
        //console.log(listing.description);
         if(!listing){
            req.flash("error","Cannot find that listing!!");
            return res.redirect("/listings");
    }
        res.render("listings/edit.ejs",{listing});
    })
);

//Update route
router.put(
    "/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(async(req,res)=>{
       
        let {id} = req.params;
        //const updatedListing = await Listing.findByIdAndUpdate(id,req.body.listing,{new:true});
     
        await Listing.findByIdAndUpdate(id,{...req.body.listing});
        req.flash("success","Listing Updated Successfully!!");
        res.redirect(`/listings/${id}`);
        //console.log(updatedListing);
    })
);

//DEELETE route
router.delete(
    "/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(async(req,res)=>{
        const {id} = req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        req.flash("success","Listing Deleted Successfully!!");
        res.redirect("/listings");
    })
);




module.exports = router;