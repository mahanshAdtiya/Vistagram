import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product : {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
    rating: { type: Number, required: true, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }

}, { timestamps: true });
export const Review = mongoose.model('Review', reviewSchema);


