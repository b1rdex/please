imported.test = (data, callback) ->
  # some work
  console.log 'called test work with data', data

  callback null, 'produced'
