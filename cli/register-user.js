const delay = require('delay');
const inquirer = require('inquirer');
const { nupnpSearch } = require('node-hue-api');
const awaitableWrap = require('../lib/awaitableWrap');

module.exports = async function registerUserCli(app) {
  let { api } = app.plugins.get('hue');

  let { howToFindBridge } = await inquirer.prompt({
    name: 'howToFindBridge',
    message: 'How shall we find your bridge?',
    type: 'list',
    choices: [
      {
        name: 'Automatically (via N-UPnP)',
        value: 'auto'
      },
      {
        name: 'Manually enter a hostname or IP address',
        value: 'manual'
      }
    ]
  });

  let host = await (howToFindBridge === 'auto'
    ? getHostViaUpnp()
    : getHostViaPrompt());

  if (!host) {
    console.log('No bridge could be found :(');
    return;
  }

  let { userDescription } = await inquirer.prompt({
    name: 'userDescription',
    message:
      'Please provide a brief description for this new user. This will be saved in your bridge.',
    default: 'Watney Hue Plugin',
    validate: input => !!input
  });

  console.log('Now go ahead and press the link button on the thing...');

  let retriesLeft = 6;

  while (retriesLeft--) {
    await delay(10000);

    try {
      let newUser = await awaitableWrap(
        api.registerUser(host, userDescription)
      );

      console.log('Success! Now save these values in your Watney config:');
      console.log(`host: ${host}`);
      console.log(`username: ${newUser}`);

      return;
    } catch (error) {
      console.log(`[${error.message}] Retrying ${retriesLeft} more times...`);
    }
  }

  async function getHostViaUpnp() {
    let bridges = await awaitableWrap(nupnpSearch());

    if (bridges.length === 1) {
      let [bridge] = bridges;

      console.log(`Found bridge "${bridge.name}" at ${bridge.ipaddress}.`);

      return bridge.ipaddress;
    }

    if (bridges.length > 1) {
      let { bridgeId } = await inquirer.prompt({
        name: 'bridgeId',
        message: 'Multiple bridges were found. Which one shall we use?',
        type: 'list',
        choices: bridges.map(bridge => ({
          name: `${bridge.name} (${bridge.ipaddress} ${bridge.mac})`,
          value: bridge.id
        }))
      });

      return bridges.find(bridge => bridge.id === bridgeId).ipaddress;
    }
  }
};

async function getHostViaPrompt() {
  let { host } = await inquirer.prompt({
    name: 'host',
    message: 'What is the hostname or IP address of your bridge?'
  });

  return host;
}
