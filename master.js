const cluster = require('cluster');
const colors  = require('colors');

const argv = process.argv.slice(2);

// Possible instance statues
const INSTANCE_STATUS = {
  BOOTING  : 'BOOTING',
  READY    : 'READY',
  ONLINE   : 'ONLINE',
  SHUTDOWN : 'SHUTDOWN',
};

// HTTP Ports
const INSTANCE_PORT = 8080;
const MASTER_PORT   = 8081;

// Secret for controlling instances
const SECRET_TOKEN = 'k0k0dajs';

// Instances
const INSTANCES       = [];
const COUNT_INSTANCES = parseInt(argv.shift(), 10) || 1; // Set number of instances we want

(async () => {
  if ( cluster.isMaster ) {
    /**
     * MASTER
     */
    console.info(`[M] Master ${process.pid} is started. Instances ${INSTANCES.length}`.green);
    console.info(`[M] Secret token: ${SECRET_TOKEN}`.green);

    console.log(`[M] Started forking`.blue);
    for ( let i = 0; i < COUNT_INSTANCES; i++ ) {
      const instance = await forkInstance(i);
      INSTANCES.push(instance);
    }
    console.log(`[M] Done forking`.blue);

    const control = require('./modules/control');

    // Initiate  control server
    await control.init(MASTER_PORT, SECRET_TOKEN, updateInstances);
  } else {
    /**
     * INSTANCE
     */
    console.info(`Instance ${process.pid} is started.`.cyan);
    const instance = require('./modules/instance');
    await instance.init(INSTANCE_PORT);


  }
})();


/**
 * Update instances
 * @returns {Promise.<void>}
 */
async function updateInstances() {
  console.log(`[M][U] Start updating`.magenta);
  for ( let i = 0; i < INSTANCES.length; i++ ) {
    const oldInstance = INSTANCES.shift();
    // Wait for instance to get online, and push it to INSTANCES
    const newInstance = await forkInstance(`R${i}`);
    INSTANCES.push(newInstance);

    await new Promise(( resolve ) => {
      console.log(`[M][U] Killing Old Instance`.yellow);
      oldInstance.disconnect();
      const killTimeout = setTimeout(() => {
        console.warn('[M][U] Old Instance reached timeout! KILLING'.red);
        oldInstance.kill();
      }, 2000);
      oldInstance.on('disconnect', () => {
        clearTimeout(killTimeout);
        console.log(`[M][U] Old Instance is DOWN`.yellow);
        resolve();
      });
    })
  }
  console.log(`[M][U] Finished updating`.green)
}

/**
 * Fork instances
 * @param i
 * @returns {Promise.<process>}
 */
async function forkInstance( i ) {
  console.log(`[M] Forking instance ${i}`.magenta);
  const instance = cluster.fork();

  return new Promise(( resolve ) => {
    instance.on('listening', () => {
      console.log(`[M] Forked instance ${i} is ONLINE`.green);
      resolve(instance);
    })
  });
}
