module.exports = {

  ran_no: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  uid: function (len) {
    var str = '';
    var src = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var src_len = src.length;
    var i = len;

    for (; i--;) {
      str += src.charAt(this.ran_no(0, src_len - 1));
    }

    return str;
  },

  forbidden: function (res) {
    var body = 'Forbidden';
    res.statusCode = 403;

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', body.length);
    res.end(body);
  }
};
/************************************************************************
*   This is a set of functions to search entire DB by simple keyword.   *
*                                                                       *
*   Developered by Won Dong(fkiller@gmail.com)                          *
*                                                                       *
*   * Usage: searchAll('any keyword')                                   *
*                                                                       *
*************************************************************************/

function createOR(fieldNames, keyword) {
  var query = [];
  fieldNames.forEach(function (item) {
    var temp = {};
    temp[item] = { $regex: '.*' + keyword + '.*' };
    query.push(temp);
  });
  if (query.length == 0) return false;
  return { $or: query };
}

function keys(collectionName) {
  mr = db.runCommand({
    'mapreduce': collectionName,
    'map': function () {
      for (var key in this) { emit(key, null); }
    },
    'reduce': function (key, stuff) { return null; },
    'out': 'my_collection' + '_keys'
  });
  return db[mr.result].distinct('_id');
}

function findany(collection, keyword) {
  var query = createOR(keys(collection.getName()));
  if (query) {
    return collection.findOne(query, keyword);
  } else {
    return false;
  }
}

function searchAll(keyword) {
  var all = db.getCollectionNames();
  var results = [];
  all.forEach(function (collectionName) {
    print(collectionName);
    if (db[collectionName]) results.push(findany(db[collectionName], keyword));
  });
  return results;
}