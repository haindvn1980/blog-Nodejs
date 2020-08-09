const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');
const { init } = require('./category.model');
const categorySchema = new mongoose.Schema({
  title: { type: String, require: true },
  category_code: { type: String, require: true },
  sub_content: { type: String, require: true },
  main_content: { type: String, require: true },
  image_name: { type: String, require: true },
  author: { type: String },
  status: { type: Boolean, default: true },
}, { timestamps: true });

const Posts = mongoose.model('blog_posts', categorySchema);
module.exports = Posts;