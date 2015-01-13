(function() {
  imported['nacl-encrypt'] = function(data, callback) {
    var encryptedBase64, encryptedBytes, message, messageBytes, nonce, nonceBase64, nonceBytes, publicKeyTo, secretKeyFrom;
    (function() {
      if (typeof nacl === "undefined" || nacl === null) {
        return importScripts('/bower_components/tweetnacl/nacl-fast-for-workers.js');
      }
    })();
    message = data.message;
    secretKeyFrom = data.secretKeyFrom;
    publicKeyTo = data.publicKeyTo;
    if (!(message && secretKeyFrom && publicKeyTo)) {
      return callback('wrong data provided');
    }
    nonce = data.nonce;
    if (nonce) {
      nonceBase64 = nonce;
      nonceBytes = nacl.util.decodeBase64(nonceBase64);
    } else {
      nonceBytes = nacl.randomBytes(nacl.box.nonceLength);
      nonceBase64 = nacl.util.encodeBase64(nonceBytes);
    }
    messageBytes = nacl.util.decodeUTF8(message);
    encryptedBytes = nacl.box(messageBytes, nonceBytes, publicKeyTo, secretKeyFrom);
    encryptedBase64 = nacl.util.encodeBase64(encryptedBytes);
    return callback(null, {
      nonce: nonceBase64,
      message: encryptedBase64
    });
  };

}).call(this);
