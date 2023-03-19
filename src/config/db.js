require("dotenv").config();
const mongoose = require("mongoose");

// URI call 
const { MONGODB_URI } = process.env; 

// connect to db using async function
const connectToDB = async () =>{
try {
    await mongoose.connect(MONGODB_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology:true,
        });
        console.log("DB Connect");
} catch (error) {
    console.log(error);
    }
}

connectToDB();