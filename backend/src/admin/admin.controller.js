import AdminModel from "./admin.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import logger from "../logger/logger.js";
import ApplicationError from "../error/error.applicationError.js";
import CoustomerModel from "../coustomer/coustomer.schema.js";

export default class AdminController {
  //Register
  async register(req, res, next) {
    try {
      const { name, mobaile, password } = req.body;
      logger.info("Admin register attempt", { mobaile });
      const exitMobaile = await AdminModel.findOne({ mobaile });
      if (exitMobaile) {
        logger.warn("Admin already exists", { mobaile });
        throw new ApplicationError("Admin already exists", 400);
      }
      // convert password in bcrypt password
      const hasPassword = await bcrypt.hash(password, 12);
      const admin = new AdminModel({ name, mobaile, password: hasPassword });
      await admin.save();
      logger.info("Admin registered successfully", { adminId: admin._id });
      res.status(201).json("Admin Registred Succesfull");
    } catch (err) {
      logger.error("Admin register error", { message: err.message });
      next(err);
    }
  }

  //Login
  async login(req, res, next) {
    try {
      const { mobaile, password } = req.body;
      logger.info("Admin login attempt", { mobaile });
      const admin = await AdminModel.findOne({ mobaile });
      if (!admin) {
        logger.warn("Admin login failed: mobile does not exist", { mobaile });
        throw new ApplicationError("Mobaile Number Does not exists", 400);
      }
      const adminPassword = await bcrypt.compare(password, admin.password);
      if (!adminPassword) {
        logger.warn("Admin login failed: incorrect password", { mobaile });
        throw new ApplicationError("Password Not Correct", 400);
      }
      const token = jwt.sign(
        {
          userID: admin._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "30d",
        }
      );
      admin.sessions.push(token);
      await admin.save();
      logger.info("Admin logged in", { adminId: admin._id });
      res.status(201).json(token);
    } catch (err) {
      logger.error("Admin login error", { message: err.message });
      next(err);
    }
  }

  // Profile
  async profile(req, res, next) {
    try {
      const admin = await AdminModel.findById(req.userID).select(
        "_id name mobaile date"
      );
      if (!admin) {
        throw new ApplicationError("Admin not found", 404);
      }
      logger.info("Admin profile fetched", { adminId: admin._id });
      res.status(200).json(admin);
    } catch (err) {
      logger.error("Admin profile error", { message: err.message });
      next(err);
    }
  }

  // metrics
  async metrics(req, res, next) {
    try {
      const adminID = req.userID;
      const now = new Date();

      // Set time boundaries
      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        0
      );
      const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999
      );
      const startOfWeek = new Date(
        startOfDay.getTime() - 6 * 24 * 60 * 60 * 1000
      );
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const endOfYear = new Date(now.getFullYear() + 1, 0, 0, 23, 59, 59, 999);

      const rangeAgg = async (start, end) => {
        const result = await CoustomerModel.aggregate([
          { $match: { adminID } },
          { $unwind: "$transactions" },
          { $match: { "transactions.date": { $gte: start, $lte: end } } },
          {
            $group: {
              _id: null,
              totalSalesAmount: {
                $sum: {
                  $multiply: ["$transactions.price", "$transactions.quantity"],
                },
              },
              totalDueOutstanding: { $sum: "$transactions.amountDue" },
            },
          },
        ]);

        if (result.length === 0) {
          return {
            totalSalesAmount: 0,
            totalRevenueCollected: 0,
            totalDueOutstanding: 0,
          };
        }

        const metrics = result[0];
        const totalRevenueCollected =
          metrics.totalSalesAmount - metrics.totalDueOutstanding;

        return {
          totalSalesAmount: metrics.totalSalesAmount || 0,
          totalRevenueCollected: Math.max(0, totalRevenueCollected),
          totalDueOutstanding: metrics.totalDueOutstanding || 0,
        };
      };

      const day = await rangeAgg(startOfDay, endOfDay);
      const weekly = await rangeAgg(startOfWeek, endOfDay);
      const monthly = await rangeAgg(startOfMonth, endOfMonth);
      const yearly = await rangeAgg(startOfYear, endOfYear);

      logger.info("Admin metrics computed", {
        adminId: adminID,
        day,
        weekly,
        monthly,
        yearly,
      });
      res.status(200).json({ day, weekly, monthly, yearly });
    } catch (err) {
      logger.error("Admin metrics error", { message: err.message });
      next(err);
    }
  }
}
