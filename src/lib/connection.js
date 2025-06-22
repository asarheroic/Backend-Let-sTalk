const { config } = require("dotenv");
const mongoose = require("mongoose");

config()

 
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL)
    console.log('database connected');
  } catch (error) {
    console.log('error while connecting database');
  }
}


module.exports = {connectDB}