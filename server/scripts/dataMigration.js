import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';  // Adjust if needed
import { Post } from '../models/post.model.js';  // Adjust if needed

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Utility: parse CSV to array of objects
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
};

// Import users from CSV
const importUsers = async () => {
  const filePath = path.join('data', 'dummy_users.csv');
  const rows = await parseCSV(filePath);

  const users = await Promise.all(
    rows.map(async (row) => ({
      username: row.username,
      email: row.email,
      password: await bcrypt.hash(row.password, 10),
      profilePicture: row.profilePicture || '',
      bio: row.bio || '',
    }))
  );

  try {
    await User.insertMany(users);
    console.log(`✅ Imported ${users.length} users`);
  } catch (err) {
    console.error('❌ Error importing users:', err);
    throw err;
  }
};

const importPosts = async () => {
  const filePath = path.join('data', 'dummy_posts.csv');
  const rows = await parseCSV(filePath);

  let imported = 0;

  for (const row of rows) {
    const user = await User.findOne({ username: row.author });

    if (!user) {
      console.warn(`⚠️ User not found for post: "${row.caption}" by ${row.author}`);
      continue;
    }

    try {
      const hashtags = row.hashtags ? row.hashtags.split(' ').filter(Boolean) : [];

      const post = await Post.create({
        caption: row.caption || '',
        image: row.image,
        hashtags,
        author: user._id,
      });

      user.posts.push(post._id);
      await user.save();

      imported++;
    } catch (err) {
      console.error(`❌ Error saving post "${row.caption}":`, err.message);
    }
  }

  console.log(`✅ Imported ${imported} posts`);
};

// Run the full import
const runImport = async () => {
  try {
    await importUsers();
    await importPosts();
    console.log('✅ All data imported successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Import failed:', err);
    process.exit(1);
  }
};

runImport();
