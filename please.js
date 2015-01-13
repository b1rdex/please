(function() {
  var callbacks, handlers, id, instances, log;

  log = (typeof debug === "function" ? debug('please') : void 0) || console.log.bind(console);

  handlers = {};

  callbacks = {};

  instances = [];

  (function() {
    Object.defineProperty(instances, 'getInstance', {
      value: function() {
        if (this.length === 0) {
          return this.spawn();
        } else {
          return this[Math.floor(Math.random() * this.length)];
        }
      }
    });
    return Object.defineProperty(instances, 'spawn', {
      value: function() {
        var worker;
        worker = new Worker('/bower_components/please/worker.js');
        this.push(worker);
        worker.onerror = function(error) {
          log('worker onerror', error);
        };
        worker.onmessage = function(event) {
          var message;
          message = event.data;
          if ('executed' in callbacks[message.id]) {
            return;
          }
          callbacks[message.id].executed = true;
          callbacks[message.id](message.error, message.data);
        };
        return worker;
      }
    });
  })();

  id = 0;

  self.please = function(fn, data, callback, progressCallback) {
    var error, handler, instance;
    if (!callback || typeof callback !== 'function') {
      callback = function(error, data) {
        return log('callback stub called', error, data);
      };
    }
    handler = handlers[fn];
    if (!handler) {
      error = new Error('no such handler registered ' + fn);
      return callback(error);
    }
    instance = instances.getInstance();
    instance.postMessage({
      id: id,
      fn: fn,
      handler: handler,
      data: data
    });
    callbacks[id++] = callback;
    return please;
  };

  please["do"] = please;

  please.registerHandler = function(name, handler) {
    var blob, path;
    if (name in handlers) {
      log('register hadler', name, 'overwrote');
    }
    if (typeof handler === 'function') {
      blob = new Blob(["imported['" + name + "'] = " + (handler.toString())]);
      path = URL.createObjectURL(blob);
    } else {
      path = "workers/" + name + ".js";
    }
    handlers[name] = path;
    return please;
  };

  please.unregisterHandler = function(name) {
    if (name in handlers) {
      handlers[name] = null;
      delete handlers[name];
    }
    return please;
  };

}).call(this);
