(function() {
  imported.test = function(data, callback) {
    console.log('called test work with data', data);
    return callback(null, 'produced');
  };

}).call(this);
