import FishModel from "./fish.schema.js";
import logger from "../logger/logger.js";
import ApplicationError from "../error/error.applicationError.js";

export default class FishController {
  //add fish
  async addFish(req, res, next) {
    try {
      logger.info("Add fish request", { body: req.body });
      const newFish = new FishModel({ ...req.body, adminID: req.userID });
      await newFish.save();
      logger.info("Fish added", { fishId: newFish._id });
      res.status(201).send("New Fish Item Added");
    } catch (err) {
      logger.error("Add fish error", { message: err.message });
      next(err);
    }
  }
  //one fish details check
  async fishDetails(req, res, next) {
    try {
      const fishID = req.params.fishID;
      const fishDetails = await FishModel.findOne({
        _id: fishID,
        adminID: req.userID,
        isDeleted: false,
      });
      if (!fishDetails) {
        logger.warn("Fish details not found", { fishID });
        return res.status(401).send("Fish not found");
      }
      res.status(200).json(fishDetails);
    } catch (err) {
      logger.error("Fish details error", { message: err.message });
      next(err);
    }
  }
  //display All fish
  async displayAllFish(req, res, next) {
    try {
      const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

      // Fetch fish entries matching the current date and adminID (exclude deleted fish)
      const fishes = await FishModel.find({
        adminID: req.userID,
        isDeleted: false,
        date: {
          $gte: new Date(currentDate), // Start of the day
          $lt: new Date(new Date(currentDate).getTime() + 24 * 60 * 60 * 1000), // Start of the next day
        },
      });
      res.status(200).json(fishes); // Send the filtered list to the frontend
    } catch (err) {
      logger.error("Display all fish error", { message: err.message });
      next(err);
    }
  }

  //delete fish one-by-one (soft delete)
  async deleteFish(req, res, next) {
    try {
      const fish = await FishModel.findOne({
        _id: req.params.id,
        adminID: req.userID,
      });
      if (!fish) {
        logger.warn("Delete fish not found or unauthorized", {
          id: req.params.id,
        });
        return res
          .status(400)
          .send(`Fish with ID ${req.params.id} not found or unauthorized`);
      }
      // Soft delete: mark as deleted instead of removing from DB
      fish.isDeleted = true;
      await fish.save();
      logger.info("Fish marked as deleted", { id: req.params.id });
      res
        .status(200)
        .send(`Fish with ID ${req.params.id} successfully deleted`);
    } catch (err) {
      logger.error("Delete fish error", { message: err.message });
      next(err);
    }
  }
  //Update fish one-by-one
  async updateFish(req, res, next) {
    try {
      const editData = await FishModel.findById({
        _id: req.params.id,
        adminID: req.userID,
      });
      if (!editData) {
        logger.warn("Update fish not found or unauthorized", {
          id: req.params.id,
        });
        return res
          .status(400)
          .send(`Fish with ID ${req.params.id} not found or unauthorized`);
      }
      //hare add what part i update...
      if (req.body.name) {
        let name = req.body.name;
        for (var i = 0; i < name.length; i++) {
          if (!isNaN(Number(name[i]))) {
            logger.warn("Invalid fish name", { name });
            return res.status(201).json({ message: "Name must be String" });
          }
        }
      }
      editData.name = req.body.name || editData.name;
      editData.price = req.body.price || editData.price;
      editData.availableQuantity =
        req.body.availableQuantity || editData.availableQuantity;
      await editData.save();
      logger.info("Fish updated", { id: req.params.id });
      res
        .status(200)
        .send(`Fish with ID ${req.params.id} successfully updated`);
    } catch (err) {
      logger.error("Update fish error", { message: err.message });
      next(err);
    }
  }
}
