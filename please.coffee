log = debug?('please') || console.log.bind console

handlers = {}
callbacks = {}

instances = []
(->
  Object.defineProperty instances, 'getInstance',
    value: ->
      if this.length is 0
        this.spawn()
      else
        this[ Math.floor(Math.random() * this.length) ]

  Object.defineProperty instances, 'spawn',
    value: ->
      worker = new Worker 'worker.js'
      this.push worker
      worker.onerror = (error) ->
        log 'worker onerror', error
        return

      worker.onmessage = (event) ->
        log 'worker onmessage', event, event.data
        message = event.data
        return if 'executed' of callbacks[message.id]
        callbacks[message.id].executed = true
        callbacks[message.id](message.error, message.data)
        return

      return worker
)()

id = 0

self.please = (fn, data, callback, progressCallback) ->
  if !callback or typeof(callback) isnt 'function'
    callback = (error, data) ->
      log 'callback stub called', error, data

  handler = handlers[fn]
  if !handler
    error = new Error 'no such handler registered'
    return callback error

  instance = instances.getInstance()
  instance.postMessage
    id: id
    fn: fn
    handler: handler
    data: data

  # TODO: call callback(error) on timeouts

  callbacks[id++] = callback

  return please

please.do = please

please.registerHandler = (name, handler) ->
  if name of handlers
    log 'register hadler', name, 'overwrote'

  if typeof handler is 'function'
    blob = new Blob ["imported['#{name}'] = #{handler.toString()}"]
    path = URL.createObjectURL blob
  else
    path = "workers/#{name}.js"

  handlers[name] = path

  return please

please.unregisterHandler = (name) ->
  if name of handlers
    handlers[name] = null
    delete handlers[name]

  return please
