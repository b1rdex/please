imported['nacl-decrypt'] = (data, callback) ->
  (->
    if not nacl?
      importScripts '/bower_components/tweetnacl/nacl-fast-for-workers.js'
  )()

  messageBase64 = data.message
  nonceBase64 = data.nonce
  publicKeyFrom = data.publicKeyFrom
  secretKeyTo = data.secretKeyTo

  unless messageBase64 and nonceBase64 and publicKeyFrom and secretKeyTo
    return callback 'wrong data provided'

  messageBytes = nacl.util.decodeBase64 messageBase64
  nonceBytes = nacl.util.decodeBase64 nonceBase64

  secretKeyBytes = secretKeyTo

  decryptedBytes = nacl.box.open messageBytes, nonceBytes, publicKeyFrom, secretKeyBytes
  decrypted = nacl.util.encodeUTF8 decryptedBytes

  callback null, decrypted
