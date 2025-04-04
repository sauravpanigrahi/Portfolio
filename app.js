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

// Fix MongoDB connection string
let dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/portfolio";

// Log the raw connection string (with credentials redacted)
console.log("Raw MongoDB connection string (redacted):", 
    dbUrl ? dbUrl.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') : "No connection string provided");

// Ensure the connection string has the correct format
if (dbUrl && !dbUrl.startsWith('mongodb://') && !dbUrl.startsWith('mongodb+srv://')) {
    console.error("Invalid MongoDB connection string format. It should start with 'mongodb://' or 'mongodb+srv://'");
    console.error("Current connection string (redacted):", dbUrl.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    
    // Try to fix the connection string if it's missing the protocol
    if (dbUrl.includes('@')) {
        // It looks like a MongoDB Atlas connection string without the protocol
        dbUrl = "mongodb+srv://" + dbUrl;
        console.log("Fixed connection string (redacted):", dbUrl.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    } else {
        // Use a fallback connection string
        const fallbackUrl = "mongodb://127.0.0.1:27017/portfolio";
        console.log("Using fallback connection string:", fallbackUrl);
        dbUrl = fallbackUrl;
    }
}

// Fix password encoding issues
if (dbUrl && (dbUrl.startsWith('mongodb://') || dbUrl.startsWith('mongodb+srv://'))) {
    try {
        // Extract username and password from the connection string
        const match = dbUrl.match(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/);
        if (match) {
            const protocol = match[1] ? 'mongodb+srv' : 'mongodb';
            const username = match[2];
            const password = match[3];
            const restOfUrl = dbUrl.substring(match[0].length);
            
            // URL encode the password
            const encodedPassword = encodeURIComponent(password);
            
            // Reconstruct the connection string with encoded password
            dbUrl = `${protocol}://${username}:${encodedPassword}@${restOfUrl}`;
            console.log("Connection string with encoded password (redacted):", 
                dbUrl.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
        }
    } catch (err) {
        console.error("Error encoding password:", err.message);
    }
}

// Log the final connection string (with credentials redacted)
console.log("Final MongoDB connection string (redacted):", 
    dbUrl.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));

const homeRouter = require("./routes/home.js"); // Home-related routes start with /home

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
        console.log("Attempting to connect to MongoDB...");
        console.log("Connection string format (redacted):", 
            dbUrl.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
        
        // Check if the connection string contains credentials
        if (!dbUrl.includes('@') || !dbUrl.includes('://')) {
            console.error("Invalid connection string format. Missing credentials or protocol.");
            throw new Error("Invalid MongoDB connection string format");
        }
        
        // Extract username from connection string for logging
        const usernameMatch = dbUrl.match(/\/\/([^:]+):/);
        if (usernameMatch) {
            console.log("Attempting to connect with username:", usernameMatch[1]);
        }
        
        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB connection successful!");
    } catch (err) {
        console.error("Mongoose connection error:", {
            message: err.message,
            code: err.code,
            name: err.name,
            stack: err.stack
        });
        
        // Provide more specific error messages based on error type
        if (err.name === 'MongoServerError' && err.code === 8000) {
            console.error("Authentication failed. Please check your username and password.");
            console.error("Make sure the user has the correct permissions in MongoDB Atlas.");
        } else if (err.name === 'MongoParseError') {
            console.error("Connection string parsing error. Please check the format of your connection string.");
        } else if (err.name === 'MongoNetworkError') {
            console.error("Network error. Please check your internet connection and MongoDB Atlas network access settings.");
        }
        
        // Don't throw the error, just log it and continue with a fallback
        console.log("Using fallback connection or continuing without database connection");
    }
}

// Create session options with error handling
let sessionOptions = {
    secret: process.env.SECRET || "my secretcode",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

// Only add MongoDB store if connection string is valid
if (dbUrl && (dbUrl.startsWith('mongodb://') || dbUrl.startsWith('mongodb+srv://'))) {
    try {
        console.log("Attempting to create MongoDB session store...");
        sessionOptions.store = MongoStore.create({
            mongoUrl: dbUrl,
            touchAfter: 24 * 3600 // time period in seconds
        });
        console.log("MongoDB session store created successfully");
    } catch (err) {
        console.error("Error creating MongoDB session store:", {
            message: err.message,
            name: err.name,
            stack: err.stack
        });
        
        // Provide more specific error messages based on error type
        if (err.name === 'MongoServerError' && err.code === 8000) {
            console.error("Session store authentication failed. Please check your MongoDB credentials.");
        }
        
        console.log("Using memory session store instead");
    }
} else {
    console.log("Invalid MongoDB connection string, using memory session store");
}

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