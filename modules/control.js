const express = require('express');

/**
 * Initiate control module
 * @param port
 * @param token
 * @param updateCall
 * @returns {Promise}
 */
exports.init = async ( port, token, updateCall ) => {
  const app = express();

  app.get('/update/:token', ( req, res ) => {
    // Send 401 if un authenticated
    if ( !req.params['token'] || req.params['token'] !== token ) res.sendStatus(401);
    // Trigger update callback
    updateCall();

    res.sendStatus(200);
  });

  // Start control HTTP server
  return new Promise(( resolve, reject ) => {
    app.listen(port, ( err ) => {
      if ( err ) return reject(err);
      resolve();
    })
  })
};