import express from "express";

import { addReview, getReviews, editReview, deleteReview} from "../controllers/review.Controller.js";

const router = express.Router();

// /review
router.route('/create').post(addReview);
router.route('').get(getReviews);
router.route('/edit').put(editReview);
router.route('/delete').delete(deleteReview); 

export default router;