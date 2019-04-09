// tslint:disable:no-console
import { WatneyApp } from 'watney-app';
import { HuePlugin } from '../lib/HuePlugin';

/**
 * CLI function that prints out the names of all the Hue lights and lights groups.
 *
 * Useful as a reference when designing Watney scripts.
 *
 * @param {WatneyApp} app
 */
export async function getLightsAndGroupsCli(app: WatneyApp) {
  const hue = app.plugins.get('hue') as HuePlugin;

  await hue.init();

  const lightNames = Array.from(hue.getLights().map(light => light.name));
  // const groupNames = Array.from(hue.lightGroups.keys());

  console.log('Lights', JSON.stringify(lightNames, null, 2));
  // console.log('Groups', JSON.stringify(groupNames, null, 2));
}
