(function() {
  imported['nacl-keypair'] = function(data, callback) {
    (function() {
      if (typeof nacl === "undefined" || nacl === null) {
        return importScripts('/bower_components/tweetnacl/nacl-fast-for-workers.js');
      }
    })();
    return callback(null, nacl.box.keyPair());
  };

}).call(this);
