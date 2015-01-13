(function() {
  imported['nacl-decrypt'] = function(data, callback) {
    var decrypted, decryptedBytes, messageBase64, messageBytes, nonceBase64, nonceBytes, publicKeyFrom, secretKeyBytes, secretKeyTo;
    (function() {
      if (typeof nacl === "undefined" || nacl === null) {
        return importScripts('/bower_components/tweetnacl/nacl-fast-for-workers.js');
      }
    })();
    messageBase64 = data.message;
    nonceBase64 = data.nonce;
    publicKeyFrom = data.publicKeyFrom;
    secretKeyTo = data.secretKeyTo;
    if (!(messageBase64 && nonceBase64 && publicKeyFrom && secretKeyTo)) {
      return callback('wrong data provided');
    }
    messageBytes = nacl.util.decodeBase64(messageBase64);
    nonceBytes = nacl.util.decodeBase64(nonceBase64);
    secretKeyBytes = secretKeyTo;
    decryptedBytes = nacl.box.open(messageBytes, nonceBytes, publicKeyFrom, secretKeyBytes);
    decrypted = nacl.util.encodeUTF8(decryptedBytes);
    return callback(null, decrypted);
  };

}).call(this);
