const express = require('express');
const ejs     = require('ejs');
const app     = express();


const VERSION = 'ALPHA';
// const VERSION = 'BETA';

/**
 * Initiate instance
 * @param port
 * @returns {Promise}
 */
exports.init = async ( port ) => {
  app.set('view engine', 'ejs');
  app.set('views', 'app');

  // Respond on request
  app.get('/', ( req, res ) => {
    res.render('index', { version : VERSION, pid : process.pid })
  });

  // Start listening
  return new Promise(( resolve, reject ) => {
    setTimeout(() => {
      app.listen(port, ( err ) => {
        if ( err ) return reject(err);
        resolve();
      })
    }, 1000) // Wait 1 sec before starting to listen
  })
};
