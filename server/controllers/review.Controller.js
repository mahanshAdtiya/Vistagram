import {Review} from "../models/review.model.js";


export const addReview = async (req, res) => {
    try{
        const {text, product_id, user_id, rating} = req.body;
        if (!text || !product_id || !user_id || !rating) {
            return res.status(400).json({success: false, message: "All fields are required"});
        }

        await Review.create({
            text, 
            author : user_id,
            product : product_id,
            rating
        });
        return res.status(201).json({
            message: "Review Created Successfully",
            success: true,
        });

    }catch (error) {
        console.error("Error adding review:", error);
        return res.status(500).json({success: false, message: "Internal server error"});
    }
}

export const getReviews = async (req, res) => {
    try {
        const { product_id } = req.body;
        let { pageSize, pageNumber } = req.query;

        pageSize = parseInt(pageSize) || 10;
        pageNumber = parseInt(pageNumber) || 1;

        const skip = (pageNumber - 1) * pageSize;
        
        if (!product_id) {
            return res.status(400).json({ success: false, message: "Product ID is required" });
        }


        const querryFilter = {
            product: product_id,
        }

        const reviews = await Review.find(querryFilter)
            .populate('author', 'username')
            .sort({ createdAt: -1 }) // Sort by creation date, newest first
            .skip(skip)
            .limit(pageSize);
        if (reviews.length === 0) {
            return res.status(404).json({ success: false, message: "No reviews found for this product" });
        }
        // TO DO: ADD PAGINATION, sorting on date, filtering on based of rating
        // const reviews = await Review.find({ product: product_id }).populate('author', 'username');
        return res.status(200).json({ success: true, reviews });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const editReview = async (req, res) => {
    try{
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: "Review ID is required" });
        }
        const { text, rating } = req.body;
        if (!text || !rating) {
            return res.status(400).json({ success: false, message: "Text and rating are required" });
        }
        const review = await Review.findByIdAndUpdate(
            id,
            { text, rating, updatedAt: Date.now() },
            { new: true }
        ).populate('author', 'username');

        await review.save();

        return res.status(200).json({
            message: 'Profile updated.',
            success: true,
            review,
        });
    }
    catch (error) {
        console.error("Error editing review:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const deleteReview = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: "Review ID is required" });
        }
        await Review.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
        console.error("Error deleting review:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};