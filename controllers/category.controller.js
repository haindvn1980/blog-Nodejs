const mongo = require('mongodb');
const validator = require('validator');
var session = require('express-session');
const lusca = require('lusca');

const Category = require('../models/category.model.js');


exports.getAddCategory = (req, res) => {
  res.render('addcategory.ejs', { title: 'Add category' });
}

exports.postAddCategory = (req, res, next) => {
  //kiểm tra dữ liệu nhập vào
  const validationErrors = [];
  if (validator.isEmpty(req.body.CategoryCode)) validationErrors.push({ msg: 'Please enter category code.' });
  if (validator.isEmpty(req.body.CategoryName)) validationErrors.push({ msg: 'Please enter category name.' });
  //neu co loi show ra man hinh
  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/addcategory')
  }
  //thiet lap gia tri
  const category = new Category({
    category_code: req.body.CategoryCode,
    category_name: req.body.CategoryName
  });

  //User.findOne({ email: req.body.email }, (err, existingUser) => {
  Category.findOne({ category_code: req.body.CategoryCode }, (err, existingCategory) => {
    if (err) { return next(err); }
    if (existingCategory) {
      req.flash('errors', { msg: 'Category code already exists.' });
      return res.redirect('/addcategory');
    }
    //luu vao db
    category.save((err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: 'Category Added.' });
      res.redirect('/addcategory');
    });
  });
}
