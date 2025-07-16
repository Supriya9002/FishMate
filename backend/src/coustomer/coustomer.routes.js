import express from "express"
import CoustomerController from "./coustomer.controller.js";
import jwtAuth from "../middleware/jwt.middleware.js";

// router
const coustomerRouter = express.Router();

//instance
const coustomerController = new CoustomerController();

// All the paths to controller methods.
coustomerRouter.post("/coustomerFishBuy/:fishID", jwtAuth , (req, res)=>coustomerController.coustomer_Fish_Buy(req,res));
coustomerRouter.post("/coustomerPayforSpacificFish/:CoustomerID/:transactionID", jwtAuth , (req, res)=> coustomerController.coustomer_Pay_for_SpacificFish(req,res));
coustomerRouter.post("/coustomerDetails", jwtAuth , (req, res)=> coustomerController.coustomer_Details(req,res));
coustomerRouter.get("/getAllCoustomer", jwtAuth, (req, res)=> coustomerController.getAllCoustomer(req, res));
coustomerRouter.get("/getCoustomerDetailsByID/:coustomerID", jwtAuth, (req, res)=> coustomerController.getCoustomerDetailsByID(req, res));
coustomerRouter.post("/fullPaymentByCoustomer/:coustomerID", jwtAuth, (req, res)=> coustomerController.fullPaymentByCoustomer(req, res));
coustomerRouter.post("/onePaymentByCoustomer/:coustomerID/:transactionID", jwtAuth, (req, res)=> coustomerController.onePaymentByCoustomer(req, res));





export default coustomerRouter;