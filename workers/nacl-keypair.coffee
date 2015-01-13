imported['nacl-keypair'] = (data, callback) ->
  (->
    if not nacl?
      importScripts '/bower_components/tweetnacl/nacl-fast-for-workers.js'
  )()

  callback null, nacl.box.keyPair()
