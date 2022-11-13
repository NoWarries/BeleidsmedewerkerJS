import express from "express";
import * as levelController from "../controller/level.controller.js";
const router = express.Router();

/* GET level(s) */
router.get("/", levelController.get);

/* GET level(s) by level */
router.get("/:level", levelController.getByLevel);

export default router;