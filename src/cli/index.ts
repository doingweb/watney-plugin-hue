import * as inquirer from 'inquirer';
import { PluginCommandLineInterface, WatneyApp } from 'watney-app';
import { HuePlugin } from '../lib/HuePlugin';
import { getLightsAndGroupsCli } from './get-lights-and-groups';
import { manageUsersCli } from './manage-users';
import { registerUserCli } from './register-user';

const configuredChoices = [
  {
    name: 'Print out all of the lights and light groups',
    value: getLightsAndGroupsCli
  },
  {
    name: 'Manage users',
    value: manageUsersCli
  }
];

const unconfiguredChoices = [
  {
    name: 'Register a new bridge user for Watney',
    value: registerUserCli
  }
];

export const hueCli = new PluginCommandLineInterface(async (app: WatneyApp) => {
  const plugin = app.plugins.get('hue') as HuePlugin;

  const answers = await inquirer.prompt<{ command: CliFunction }>([
    {
      choices: plugin.isConfigured ? configuredChoices : unconfiguredChoices,
      message: 'What would you like to do?',
      name: 'command',
      type: 'list'
    }
  ]);

  await answers.command(app);
});

// TODO: Just export the one in watney-app instead?
type CliFunction = (app: WatneyApp) => Promise<void>;
