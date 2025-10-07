const express =require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req,res,next)=>{
    try{
      //req ki body se username , email , password extract kr lenge
         let {username,email,password} = req.body;
      //nye user ko create kr lenge
        const newUser = new User({email,username});
      //database ke andr user ko register krwa denge
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);//print krwa denge
        req.login(registeredUser,err=>{//automatically login krwa denge
            if(err) return next(err);
            req.flash("success","Welcome to Wanderlust!!");//flash msg
            //passport req.session.redirectUrl ko reset krdega login krne ke baad Jo woh og url url aane me issue hoga
            //isiliye req.session.redirectUrl ko locals ke pass save krwa denge ki humesha available ho aur passport locals ko reset nhi kr payege
            res.redirect(req.session.redirectUrl);

        });//ye method hai jo passport provide krta hai jo user ko
            
        
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }   
   
    
}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});
//passport.authenticate is an middleware to authenticate request
router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local",{
       
        failureRedirect:"/login",//user authenticate ni ho paya to yha redirect krdega
        failureFlash:true,//agr login me koi error aata hai to ye msg show krega
}),
    async(req,res)=>{
        req.flash("success","Welcome back to Wanderlust!!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    }
);

router.get("/logout",(req,res)=>{
    //req.logout callback ko leta haiiii
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged you out!!");
        res.redirect("/listings");
    });
});
module.exports = router;
