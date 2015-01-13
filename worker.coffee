self.log = ->
  args = arguments
  console.log.apply console, ['please:worker'].concat Array.prototype.slice.apply args

self.imported = {}

reportResult = (id, error, result) ->
  self.postMessage
    id: id
    error: error
    data: result

self.onmessage = (event) ->
  message = event.data

  id = message.id
  fn = message.fn
  handler = message.handler

  if fn not of imported
    log 'handler for', fn, 'is not imported. importing'
    importScripts handler

    if fn not of imported
      log 'handler for', fn, 'imported bad. giving up'
      return reportResult id, 'handler import error'

  imported[fn] message.data, (error, result) ->
    log 'handler for', fn, 'ran. reporting result'
    reportResult id, error, result
