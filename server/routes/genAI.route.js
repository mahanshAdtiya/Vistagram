import express from "express";
import upload from "../middlewares/multer.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

import {generateCaption} from '../controllers/genAI.controller.js'
const router = express.Router();

router.route("/generate-caption").post(isAuthenticated, upload.single('image'), generateCaption);

export default router;
