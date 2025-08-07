import mongoose from "mongoose";

// post.model.js or post.model.ts
const productSchema = new mongoose.Schema({
    product_name: { type: String, required: true },
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);
