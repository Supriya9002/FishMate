import "./env.js"
import express from "express"
import connectUsingMongoose from "./src/config/mongoose.config.js";
import adminRouter from "./src/admin/admin.routes.js";
import fishRouter from "./src/fish/fish.routes.js";
import coustomerRouter from "./src/coustomer/coustomer.routes.js";
import bodyParser from "body-parser"
import cors from "cors"

// server
const server = express();

// All Middleware
server.use(bodyParser.json());
server.use(cors());

// for all requested Related App
server.use("/api/admin", adminRouter);
server.use("/api/fish", fishRouter);
server.use("/api/coustomer",coustomerRouter);

// Main Api
server.get("/", (req, res)=>{
    res.send("Welcome To FishGuru App");
})
// console.log("process.env.Port",process.env.Port)
// Port
server.listen(process.env.Port || 2000, ()=>{
    connectUsingMongoose();
    console.log(`Server Listen is port ${process.env.Port}`);
})