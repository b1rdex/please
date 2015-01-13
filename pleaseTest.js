(function() {
  var basicTests, log, message, naclInlineTests, naclWithWorkerTests;

  log = (typeof debug === "function" ? debug('please:test') : void 0) || console.log.bind(console);

  log('starting please tests');

  basicTests = function() {
    console.time('basic tests');
    log('registering test worker');
    please.registerHandler('test');
    log('calling test worker');
    please["do"]('test', ['data', 'for', 'test']);
    log('unregistering test worker');
    please.unregisterHandler('test');
    log('calling test worker');
    please["do"]('test', ['data', 'for', 'test']);
    log('registering handler with inline function');
    please.registerHandler('inline', function(data, callback) {
      console.log('called inline handler with data', data);
      return callback(null, ['inline', 'produced', 'data']);
    });
    log('calling inline worker');
    please["do"]('inline', ['data', 'for', 'inline']);
    return console.timeEnd('basic tests');
  };

  basicTests();

  message = 'test message';

  naclWithWorkerTests = function() {
    console.time('nacl with worker tests');
    log('testing nacl-keypair handler');
    please.registerHandler('nacl-keypair');
    return please["do"]('nacl-keypair', null, function(error, keypair) {
      if (error) {
        return log('nacl-keypair error', error);
      }
      log('generated pair', keypair);
      log('registering nacl-encrypt handler');
      please.registerHandler('nacl-encrypt');
      log('calling nacl-encrypt worker');
      return please["do"]('nacl-encrypt', {
        message: message,
        secretKeyFrom: keypair.secretKey,
        publicKeyTo: keypair.publicKey
      }, function(error, ecnrypted) {
        if (error) {
          return log('nacl-encrypt error', error);
        }
        log('ecnrypted', ecnrypted);
        log('registering nacl-decrypt handler');
        please.registerHandler('nacl-decrypt');
        return please["do"]('nacl-decrypt', {
          message: ecnrypted.message,
          nonce: ecnrypted.nonce,
          publicKeyFrom: keypair.publicKey,
          secretKeyTo: keypair.secretKey
        }, function(error, decrypted) {
          if (error) {
            return log('nacl-decrypt error', error);
          }
          log('decrypted', decrypted);
          return console.timeEnd('nacl with worker tests');
        });
      });
    });
  };

  naclWithWorkerTests();

  naclInlineTests = function() {
    var decryptedBytes, encryptedBase64, encryptedBytes, encryptedBytes2, keypair, messageBytes, nonceBase64, nonceBytes, nonceBytes2;
    console.time('nacl inline tests');
    keypair = nacl.box.keyPair();
    messageBytes = nacl.util.decodeUTF8(message);
    nonceBytes = nacl.randomBytes(nacl.box.nonceLength);
    encryptedBytes = nacl.box(messageBytes, nonceBytes, keypair.publicKey, keypair.secretKey);
    encryptedBase64 = nacl.util.encodeBase64(encryptedBytes);
    nonceBase64 = nacl.util.encodeBase64(nonceBytes);
    encryptedBytes2 = nacl.util.decodeBase64(encryptedBase64);
    nonceBytes2 = nacl.util.decodeBase64(nonceBase64);
    decryptedBytes = nacl.box.open(encryptedBytes2, nonceBytes2, keypair.publicKey, keypair.secretKey);
    nacl.util.encodeUTF8(decryptedBytes);
    return console.timeEnd('nacl inline tests');
  };

  naclInlineTests();

}).call(this);
