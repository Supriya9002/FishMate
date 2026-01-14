import express from "express";
import AdminController from "./admin.controller.js";
import jwtAuth from "../middleware/jwt.middleware.js";
import CoustomerModel from "../coustomer/coustomer.schema.js";

//Express router
const adminRouter = express.Router();
//instance
const adminController = new AdminController();

// All the paths to controller methods.
adminRouter.post("/register", (req, res, next) =>
  adminController.register(req, res, next)
);
adminRouter.post("/login", (req, res, next) =>
  adminController.login(req, res, next)
);
adminRouter.get("/profile", jwtAuth, (req, res, next) =>
  adminController.profile(req, res, next)
);
adminRouter.get("/metrics", jwtAuth, (req, res, next) =>
  adminController.metrics(req, res, next)
);

// Debug endpoint to check data
adminRouter.get("/debug/customers", jwtAuth, async (req, res, next) => {
  try {
    const customers = await CoustomerModel.find({ adminID: req.userID });
    res.json({
      adminID: req.userID,
      customerCount: customers.length,
      customers,
    });
  } catch (err) {
    next(err);
  }
});

// Migration endpoint to fix missing adminID (use once to migrate data)
adminRouter.post("/migrate/set-adminid", jwtAuth, async (req, res, next) => {
  try {
    // Update all customers without adminID to have the current admin's ID
    const result = await CoustomerModel.updateMany(
      { adminID: { $exists: false } },
      { $set: { adminID: req.userID } }
    );
    res.json({
      message: "Migration complete",
      modifiedCount: result.modifiedCount,
      adminID: req.userID,
    });
  } catch (err) {
    next(err);
  }
});

export default adminRouter;
