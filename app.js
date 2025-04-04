if(process.env.NODE_ENV!="production"){
    require('dotenv').config()          //This line indicates that when we deploy or upload the file, the .env file is not uploaded or deployed
}

const express=require('express');//express is used to create the server
const app=express();//app is the instance of the express server
const path=require('path');//path is used to join the path of the file
const ejsMate = require('ejs-mate');//ejsMate is used to render the ejs file
const port=8000;//port is the port number of the server
const mongoose=require('mongoose');//mongoose is used to connect to the database
// const{ contactSchema }=require('./Schema.js');//contact schema is used to validate the data in the form
// const Contact=require('./models/contact.js');
const expressError=require('./utils/expressError.js');//express error is used to handle the error in the server
// const wrapasync=require('./utils/wrapasync.js');//wrapasync is used to wrap the async function
const flash=require('connect-flash'); //flash message shows the message after the form is submitted 
const session=require('express-session'); //session is used to store the data in the server 
const MongoStore = require('connect-mongo');
const nodemailer=require('nodemailer');//nodemailer is used to send the email  

const cors = require("cors");
require("dotenv").config(); 

const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/portfolio";
const homeRouter = require("./routes/home.js"); // Home-related routes start with /home

// Log the MongoDB connection string (with credentials redacted)
console.log("MongoDB connection string (redacted):", 
    dbUrl.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));

main()
.then(()=>{
    console.log("Database connected successfully");
    console.log("MongoDB connection state:", mongoose.connection.readyState);
})
.catch((err)=>{
    console.error("Database connection error:", {
        message: err.message,
        code: err.code,
        name: err.name,
        stack: err.stack
    });
})
async function main(){
    try {
        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    } catch (err) {
        console.error("Mongoose connection error:", {
            message: err.message,
            code: err.code,
            name: err.name,
            stack: err.stack
        });
        throw err;
    }
}



const sessionOptions = {
    secret: process.env.SECRET || "my secretcode",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: dbUrl,
        touchAfter: 24 * 3600 // time period in seconds
    }),
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.set('view engine','ejs');
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({ extended: true })); //parse the data from form to json
app.use(cors());

app.use(session(sessionOptions)); //session data is stored in the session object .
app.use(flash());//flash message shows the message after the form is submitted 




app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
});
app.use("/", homeRouter);

app.get("/",(req,res)=>{
    res.redirect("/");
 });

 




 app.all("*", (req, res, next) => {
    const err = new expressError("Page not found", 404);
    next(err);
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    if (!res.headersSent) {
        res.status(statusCode).render('listpages/error', { msg: message });
    }
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})