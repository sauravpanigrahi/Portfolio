const mongoose=require('mongoose');
const Contact=require('../models/contact');

main()
.then(()=>{
    console.log("Database connected")
})
.catch((err)=>{
    console.log("Database connection error",err)
})
async function main(){
    await mongoose.connect("mongodb://localhost:27017/portfolio")
}

// const demo=new Contact({
//     name:"saurav",
//     email:"helo@gmail.com",
//     phone:"1234567890",
//     message:"hello"
// })
// const demo1=new Contact({
//     name:"rahul",
//     email:"rahul@gmail.com",
//     phone:"986547210",
//     message:"hello bye"
// })


// Contact.insertMany([demo,demo1])

