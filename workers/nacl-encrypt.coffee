imported['nacl-encrypt'] = (data, callback) ->
  (->
    if not nacl?
      importScripts '/bower_components/tweetnacl/nacl-fast-for-workers.js'
  )()

  message = data.message
  secretKeyFrom = data.secretKeyFrom
  publicKeyTo = data.publicKeyTo

  unless message and secretKeyFrom and publicKeyTo
    return callback 'wrong data provided'

  nonce = data.nonce
  if nonce
    nonceBase64 = nonce
    nonceBytes = nacl.util.decodeBase64 nonceBase64
  else
    nonceBytes = nacl.randomBytes nacl.box.nonceLength
    nonceBase64 = nacl.util.encodeBase64 nonceBytes

  messageBytes = nacl.util.decodeUTF8 message
  encryptedBytes = nacl.box messageBytes, nonceBytes, publicKeyTo, secretKeyFrom
  encryptedBase64 = nacl.util.encodeBase64 encryptedBytes

  callback null,
    nonce: nonceBase64
    message: encryptedBase64
