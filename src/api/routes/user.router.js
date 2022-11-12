import express from "express";
import * as userController from "../controller/user.controller.js";
const router = express.Router();

/* GET status */
router.get("/:userID", userController.find);

export default router;

