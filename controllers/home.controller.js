const Posts = require('../models/posts.model.js');

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {

  Posts.find({}, {}, function (err, posts) {
    res.render('index.ejs', { posts: posts, title: 'Home' });
  });

}
