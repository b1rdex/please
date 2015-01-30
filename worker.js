(function() {
  var reportResult;

  self.log = function() {
    var args, _ref;
    args = arguments;
    if ((typeof console !== "undefined" && console !== null ? (_ref = console.log) != null ? _ref.apply : void 0 : void 0) != null) {
      return console.log.apply(console, ['please:worker'].concat(Array.prototype.slice.apply(args)));
    }
  };

  self.imported = {};

  reportResult = function(id, error, result) {
    return self.postMessage({
      id: id,
      error: error,
      data: result
    });
  };

  self.onmessage = function(event) {
    var fn, handler, id, message;
    message = event.data;
    id = message.id;
    fn = message.fn;
    handler = message.handler;
    if (!(fn in imported)) {
      log('handler for', fn, 'is not imported. importing');
      importScripts(handler);
      if (!(fn in imported)) {
        log('handler for', fn, 'imported bad. giving up');
        return reportResult(id, 'handler import error');
      }
    }
    return imported[fn](message.data, function(error, result) {
      log('handler for', fn, 'ran. reporting result');
      return reportResult(id, error, result);
    });
  };

}).call(this);
