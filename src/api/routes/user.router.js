import express from "express";
import * as userController from "../controller/user.controller.js";
const router = express.Router();

/* GET users */
router.get("/", userController.get);

/* GET userById */
router.get("/:userID", userController.getById);

export default router;

