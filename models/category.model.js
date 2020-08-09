const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');



const categorySchema = new mongoose.Schema({
  category_code: { type: String, require: true },
  category_name: { type: String, require: true, unique: true, sparse: true },
  status: { type: Boolean, default: true },
}, { timestamps: true });

const Category = mongoose.model('blog_category', categorySchema);
module.exports = Category;