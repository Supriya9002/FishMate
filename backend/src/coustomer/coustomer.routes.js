import express from "express";
import CoustomerController from "./coustomer.controller.js";
import jwtAuth from "../middleware/jwt.middleware.js";

// router
const coustomerRouter = express.Router(); 

//instance
const coustomerController = new CoustomerController();

// All the paths to controller methods.
coustomerRouter.post("/coustomerFishBuy/:fishID", jwtAuth, (req, res, next) =>
  coustomerController.coustomer_Fish_Buy(req, res, next)
);
coustomerRouter.post(
  "/coustomerPayforSpacificFish/:CoustomerID/:transactionID",
  jwtAuth,
  (req, res, next) =>
    coustomerController.coustomer_Pay_for_SpacificFish(req, res, next)
);
coustomerRouter.post("/coustomerDetails", jwtAuth, (req, res, next) =>
  coustomerController.coustomer_Details(req, res, next)
);
coustomerRouter.get("/getAllCoustomer", jwtAuth, (req, res, next) =>
  coustomerController.getAllCoustomer(req, res, next)
);
coustomerRouter.get(
  "/getCoustomerDetailsByID/:coustomerID",
  jwtAuth,
  (req, res, next) =>
    coustomerController.getCoustomerDetailsByID(req, res, next)
);
coustomerRouter.post(
  "/fullPaymentByCoustomer/:coustomerID",
  jwtAuth,
  (req, res, next) => coustomerController.fullPaymentByCoustomer(req, res, next)
);
coustomerRouter.post(
  "/onePaymentByCoustomer/:coustomerID/:transactionID",
  jwtAuth,
  (req, res, next) => coustomerController.onePaymentByCoustomer(req, res, next)
);

export default coustomerRouter;
