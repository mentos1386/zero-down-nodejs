const express = require('express');
const ejs     = require('ejs');
const app     = express();


const VERSION = 'ALPHA';
// const VERSION = 'BETA';

const SIMULATE_LOAD_TIME = (Math.floor(Math.random() * (11)) + 5) * 1000; // Random between 5s and 15s

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
    }, SIMULATE_LOAD_TIME)
  })
};
