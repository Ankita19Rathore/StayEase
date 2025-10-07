const express=require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const methodOverride = require('method-override');
const ExpressError =require("./utils/ExpressError.js");
app.use(methodOverride('_method'));
const session = require("express-session");

const flash=require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,'/public')));

const sessionOptions = {
    secret: "mysupersecretcode",   // use strong secret in production
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
    }
};
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");



//Database connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


//Calling the main function
main()
    .then(() =>{
        console.log("Connection successful");
    })
    .catch((err) => {
        console.log(err);
    });

async function main(){
    await mongoose.connect(MONGO_URL);//node se mongo ko connect krega
    console.log("MongoDB connected");
}


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));
app.use(express.urlencoded({ extended: true }));




app.get('/',(req,res)=>{
    res.send("Hii I Am root API");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash('success') ;
    //console.log(res.locals.success);
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next(); 
});
//nya user create krne keliye
app.get("/demouser",async (req,res)=>{
    let fakeUser = new User ({
        email : "student@gmail.com",
        username:"delta-student"
    });

    let registeredUser =  await User.register(fakeUser,"chanchal123");
    res.send(registeredUser);
});

app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/", userRouter);

//Basic api for root


app.all(/.*/,(req,res,next)=>{
    next(new ExpressError(404,"Page not found!!"));
});
app.use((err,req,res,next )=>{
    let {statusCode=500 , message="Something went wrong!!"} = err;
    res.status(statusCode).render("error.ejs",{message});
    //res.status(statusCode).send(message);
    // res.send("Something went wrong!!");
});

//Server start krne keliye
app.listen(8080,()=>{
    console.log("Server started at port 8080");
});