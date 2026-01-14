import express from "express";
import FishController from "./fish.controller.js";
import jwtAuth from "../middleware/jwt.middleware.js";

// router
const fishRouter = express.Router();

//instance
const fishController = new FishController();

// All the paths to controller methods.
fishRouter.post("/add", jwtAuth, (req, res, next) =>
  fishController.addFish(req, res, next)
);
fishRouter.get("/displayallfish", jwtAuth, (req, res, next) =>
  fishController.displayAllFish(req, res, next)
);
fishRouter.delete("/delete/:id", jwtAuth, (req, res, next) =>
  fishController.deleteFish(req, res, next)
);
fishRouter.put("/update/:id", jwtAuth, (req, res, next) =>
  fishController.updateFish(req, res, next)
);
fishRouter.get("/fishDetails/:fishID", jwtAuth, (req, res, next) =>
  fishController.fishDetails(req, res, next)
);

export default fishRouter;
