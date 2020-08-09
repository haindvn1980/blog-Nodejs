var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './public' })
var mongo = require('mongodb');
const validator = require('validator');
var mkdirp = require('mkdirp');
const Posts = require('../models/posts.model.js');
const Category = require('../models/category.model.js');


exports.getAdd = (req, res, next) => {
  Category.find({}, {}, (err, categories) => {
    if (err) { return next(err); }
    res.render('addpost.ejs', { title: 'post news', categories: categories });
  })
}

exports.postAdd = (req, res, next) => {
  const validationErrors = [];
  //check lỗi
  if (validator.isEmpty(req.body.title)) validationErrors.push({ msg: 'Please enter title.' });
  if (validator.isEmpty(req.body.subcontent)) validationErrors.push({ msg: 'Please enter sub content.' });
  if (validator.isEmpty(req.body.maincontent)) validationErrors.push({ msg: 'Please enter main content.' });

  // Check Image Upload
  if (!req.file) {
    validationErrors.push({ msg: 'Please select images.' });
  }
  //neu co loi show ra man hinh
  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/Posts')
  }
  //thiet lap gia tri
  const posts = new Posts({
    title: req.body.title,
    category_code: req.body.category,
    sub_content: req.body.subcontent,
    main_content: req.body.maincontent,
    image_name: req.file.filename,
    author: req.body.author
  });
  //save
  posts.save((err) => {
    if (err) { return next(err); }
    req.flash('success', { msg: 'Post Added.' });
    res.redirect('/posts');
  });

}

exports.getShow = (req, res, next) => {
  Posts.findById(req.params.id, function (err, post) {
    if (err) { return next(err); }
    res.render('show', {
      title: 'Detail news', 'post': post
    });
  });
}

exports.postAddcomment = (req, res, next) => {
  var postid = req.body.postid;

  const validationErrors = [];
  //check lỗi
  if (validator.isEmpty(req.body.name)) validationErrors.push({ msg: 'Please enter name.' });
  if (validator.isEmpty(req.body.comment)) validationErrors.push({ msg: 'Please enter comment.' });
  //neu co loi show ra man hinh
  if (validationErrors.length) {
    Posts.findById(postid, function (err, post) {
      if (err) { return next(err); }
      req.flash('errors', validationErrors);
      return res.render('Show', { title: 'Detail news', 'post': post })
    });
  }
  //add to object
  var comments = {
    postid: postid,
    full_name: req.body.name,
    comment_content: req.body.comment,
    comment_date: new Date()
  }

  Posts.findOneAndUpdate({
    _id: postid
  }, {
    "comments": [comments]
  }, function (err, doc) {
    if (err) {
      throw err;
    } else {
      req.flash('success', { msg: 'Comment Added' });
      res.location('/posts/show/' + postid);
      res.redirect('/posts/show/' + postid);
    }
  });

  //   Posts.findOneAndUpdate(
  //     {  _id: postid },
  //     [ { $set: { "total" : { $sum: "$grades.grade" } } } ],  // The $set stage is an alias for ``$addFields`` stage
  //     { returnNewDocument: true }
  //  )

}

