import express from "express";
import * as statusController from "../controller/status.controller.js";
const router = express.Router();

/* GET status */
router.get("/", statusController.get);

export default router;