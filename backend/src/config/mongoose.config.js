import mongoose from 'mongoose';
import "./../../env.js";

const url = process.env.DB_URL || "mongodb://127.0.0.1:27017/FishGuru";
console.log(process.env.DB_URL, url)

const connectUsingMongoose = async () => {
  try {
    await mongoose.connect(url); // No need for deprecated options
    console.log("Mongodb connected using mongoose");
  } catch (err) {
    console.log("Error while connecting to db");
    console.log(err);
  }
};

export default connectUsingMongoose;