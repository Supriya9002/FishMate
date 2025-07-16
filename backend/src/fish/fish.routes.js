import express from "express"
import FishController from "./fish.controller.js"
import jwtAuth from "../middleware/jwt.middleware.js";

// router
const fishRouter = express.Router();

//instance
const fishController = new FishController();

// All the paths to controller methods.
fishRouter.post("/add", jwtAuth , (req, res)=> fishController.addFish(req, res));
fishRouter.get("/displayallfish", jwtAuth, (req, res)=> fishController.displayAllFish(req, res));
fishRouter.delete("/delete/:id", jwtAuth, (req,res)=> fishController.deleteFish(req, res));
fishRouter.put("/update/:id", jwtAuth, (req,res)=> fishController.updateFish(req, res));
fishRouter.get("/fishDetails/:fishID", jwtAuth , (req, res)=> fishController.fishDetails(req, res));


export default fishRouter;