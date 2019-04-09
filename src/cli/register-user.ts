// tslint:disable:no-console
import delay from 'delay';
import * as inquirer from 'inquirer';
import { nupnpSearch } from 'node-hue-api';
import { WatneyApp } from 'watney-app';
import { HuePlugin } from '../lib/HuePlugin';

export async function registerUserCli(app: WatneyApp) {
  const { api } = app.plugins.get('hue') as HuePlugin;

  const { howToFindBridge } = await inquirer.prompt<{
    howToFindBridge: string;
  }>({
    choices: [
      {
        name: 'Automatically (via N-UPnP)',
        value: 'auto'
      },
      {
        name: 'Manually enter a hostname or IP address',
        value: 'manual'
      }
    ],
    message: 'How shall we find your bridge?',
    name: 'howToFindBridge',
    type: 'list'
  });

  const host = await (howToFindBridge === 'auto'
    ? getHostViaUpnp()
    : getHostViaPrompt());

  if (!host) {
    console.log('No bridge could be found :(');
    return;
  }

  const { userDescription } = await inquirer.prompt<{
    userDescription: string;
  }>({
    default: 'Watney Hue Plugin',
    message:
      'Please provide a brief description for this new user. This will be saved in your bridge.',
    name: 'userDescription',
    validate: input => !!input
  });

  console.log('Now go ahead and press the link button on the thing...');

  let retriesLeft = 6;

  while (retriesLeft--) {
    await delay(10000);

    try {
      const newUser = await api.registerUser(host, userDescription);

      console.log('Success! Now save these values in your Watney config:');
      console.log(`host: ${host}`);
      console.log(`username: ${newUser}`);

      return;
    } catch (error) {
      console.log(`[${error.message}] Retrying ${retriesLeft} more times...`);
    }
  }

  async function getHostViaUpnp() {
    const bridges = (await nupnpSearch()) as INupnpSearchResultItem[];

    if (bridges.length === 1) {
      const [bridge] = bridges;

      console.log(`Found bridge "${bridge.name}" at ${bridge.ipaddress}.`);

      return bridge.ipaddress;
    }

    if (bridges.length > 1) {
      const { bridgeId } = await inquirer.prompt<{ bridgeId: string }>({
        choices: bridges.map(bridge => ({
          name: `${bridge.name} (${bridge.ipaddress} ${bridge.mac})`,
          value: bridge.id
        })),
        message: 'Multiple bridges were found. Which one shall we use?',
        name: 'bridgeId',
        type: 'list'
      });

      const bridgeToUse = bridges.find(bridge => bridge.id === bridgeId);

      if (!bridgeToUse) {
        throw new Error(
          `Weird. The bridge you selected (${bridgeId}) couldn't be found in the list of bridges...`
        );
      }

      return bridgeToUse.ipaddress;
    }
  }
}

async function getHostViaPrompt() {
  const { host } = await inquirer.prompt<{ host: string }>({
    message: 'What is the hostname or IP address of your bridge?',
    name: 'host'
  });

  return host;
}

// TODO: Another type declaration error. Submit a PR for this one too.
// https://github.com/peter-murray/node-hue-api/blob/v2.3.0/hue-api/commands/discovery.js#L51
// https://github.com/peter-murray/node-hue-api/blob/v2.3.0/hue-api/bridge-discovery.js#L165
// https://www.meethue.com/api/nupnp
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/node-hue-api/index.d.ts#L35
interface INupnpSearchResultItem {
  id: string;
  name?: string;
  ipaddress: string;
  mac?: string;
}
