import {Product} from "../models/product.model.js";


export const createProduct = async (req, res) => {
    try{
        const { product_name } = req.body;
        if (!product_name) {
            return res.status(400).json({ success: false, message: "Product name is required" });
        }

        const newProduct = await Product.create({ product_name });
        return res.status(201).json({
            message: "Product Created Successfully",
            success: true,
            product: newProduct,
        });
    }catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({success: false, message: "Internal server error"});
    }
}