import mongoose from "mongoose";

// post.model.js or post.model.ts
const postSchema = new mongoose.Schema({
  caption: { type: String, default: '' },
  image: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  hashtags: [{ type: String, lowercase: true, trim: true }],
  locationText: { type: String, default: '' },     // <-- added
  locationUrl: { type: String, default: '' },      // <-- added
}, { timestamps: true });

export const Post = mongoose.model('Post', postSchema);
