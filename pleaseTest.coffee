log = debug?('please:test') || console.log.bind console

log 'starting please tests'

basicTests = ->
  console.time 'basic tests'

  log 'registering test worker'
  please.registerHandler 'test'

  log 'calling test worker'
  please.do 'test', ['data', 'for', 'test']


  log 'unregistering test worker'
  please.unregisterHandler 'test'

  log 'calling test worker'
  please.do 'test', ['data', 'for', 'test']

  log 'registering handler with inline function'
  please.registerHandler 'inline', (data, callback) ->
    console.log 'called inline handler with data', data
    callback null, ['inline', 'produced', 'data']

  log 'calling inline worker'
  please.do 'inline', ['data', 'for', 'inline']

  console.timeEnd 'basic tests'
basicTests()

message = 'test message'

naclWithWorkerTests = ->
  console.time 'nacl with worker tests'

  log 'testing nacl-keypair handler'
  please.registerHandler 'nacl-keypair'
  please.do 'nacl-keypair', null, (error, keypair) ->
    if error
      return log 'nacl-keypair error', error

    log 'generated pair', keypair

    log 'registering nacl-encrypt handler'
    please.registerHandler 'nacl-encrypt'

    log 'calling nacl-encrypt worker'
    please.do 'nacl-encrypt',
      message: message
      secretKeyFrom: keypair.secretKey
      publicKeyTo: keypair.publicKey
    , (error, ecnrypted) ->
      if error
        return log 'nacl-encrypt error', error

      log 'ecnrypted', ecnrypted

      log 'registering nacl-decrypt handler'
      please.registerHandler 'nacl-decrypt'

      please.do 'nacl-decrypt',
        message: ecnrypted.message
        nonce: ecnrypted.nonce
        publicKeyFrom: keypair.publicKey
        secretKeyTo: keypair.secretKey
      , (error, decrypted) ->
        if error
          return log 'nacl-decrypt error', error

        log 'decrypted', decrypted

        console.timeEnd 'nacl with worker tests'
naclWithWorkerTests()

naclInlineTests = ->
  console.time 'nacl inline tests'

  keypair = nacl.box.keyPair()
  messageBytes = nacl.util.decodeUTF8 message
  nonceBytes = nacl.randomBytes(nacl.box.nonceLength)

  encryptedBytes = nacl.box(messageBytes, nonceBytes, keypair.publicKey, keypair.secretKey)
  encryptedBase64 = nacl.util.encodeBase64 encryptedBytes
  nonceBase64 = nacl.util.encodeBase64 nonceBytes

  encryptedBytes2 = nacl.util.decodeBase64 encryptedBase64
  nonceBytes2 = nacl.util.decodeBase64 nonceBase64
  decryptedBytes = nacl.box.open(encryptedBytes2, nonceBytes2, keypair.publicKey, keypair.secretKey)

  nacl.util.encodeUTF8 decryptedBytes

  console.timeEnd 'nacl inline tests'
naclInlineTests()
