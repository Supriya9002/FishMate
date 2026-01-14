import jwt from "jsonwebtoken";
import AdminModel from "./../admin/admin.schema.js";
import logger from "../logger/logger.js";
import ApplicationError from "../error/error.applicationError.js";
import mongoose from "mongoose";

const jwtAuth = (req, res, next) => {
  //1. Read the Token
  const token = req.headers["authorization"];
  logger.info("JWT auth attempt");
  // 2. if no token, return the error.
  if (!token) {
    logger.warn("Unauthorized: No token provided");
    return res.status(401).send("Unauthorized: No token provided");
  }
  //3. Verify the Token
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Check if the user associated with the token exists and if the token is still valid
    const admin = AdminModel.findOne({ _id: payload.userID, sessions: token });
    if (!admin) {
      logger.warn("Unauthorized: Invalid token or user does not exist", {
        userID: payload.userID,
      });
      return res
        .status(401)
        .send("Unauthorized: Invalid token or user does not exist");
    }
    req.userID = new mongoose.Types.ObjectId(payload.userID);
    next();
  } catch (err) {
    logger.error("JWT verification failed", { message: err.message });
    return res.status(401).send("Unauthorized: Invalid token");
  }
  // next()
};

export default jwtAuth;
