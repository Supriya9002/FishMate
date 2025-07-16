import AdminModel from "./admin.schema.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export default class AdminController{

    //Register
    async register(req, res){
        try{
            // console.log("Register Controller")
            const {name, mobaile, password} =req.body;
            // console.log(name, mobaile, password);
            const exitMobaile =await AdminModel.findOne({mobaile})
            if(exitMobaile){
                return res.status(400).json("Admin already exists");
            }
            // convert password in bcrypt password
            const hasPassword = await bcrypt.hash(password, 12);
            console.log("password",password)
            const admin = new AdminModel({name, mobaile, password: hasPassword});
            await admin.save();
            res.status(201).json("Admin Registred Succesfull");
        }catch(err){
            console.log(err);
            res.status(500).json(`${err}`);
        }
    }

    //Login
    async login(req, res){
        try{
            console.log(req.body)
            const {mobaile, password} =req.body;
            const admin =await AdminModel.findOne({mobaile});
            if(!admin){
                return res.status(400).json("Mobaile Number Does not exists");
            }
            const adminPassword =await bcrypt.compare(password, admin.password);
            console.log("adminPassword",adminPassword)
            if(!adminPassword){
                return res.status(400).json("Password Not Correct")
            }
            const token = jwt.sign(
                {
                    userID : admin._id,
                }
                ,"JCok8ibiRY",
                {
                    expiresIn: "1d",
                }
            )
            console.log("token",token);
            admin.sessions.push(token);
            await admin.save()
            res.status(201).json(token);
        }catch(err){
            console.log(err)
        }
    }
}