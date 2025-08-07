import express from "express";

import {createProduct} from "../controllers/product.controller.js";

const router = express.Router();

router.route("/createProduct").post(createProduct);

export default router;