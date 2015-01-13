(function() {
  imported.sleep = function(data, callback) {
    return setTimeout(callback, 3000);
  };

}).call(this);
