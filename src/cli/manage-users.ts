// tslint:disable:no-console
import * as inquirer from 'inquirer';
import { IRegisteredUser } from 'node-hue-api';
import { WatneyApp } from 'watney-app';
import { HuePlugin } from '../lib/HuePlugin';

export async function manageUsersCli(app: WatneyApp) {
  const hue = app.plugins.get('hue') as HuePlugin;

  await hue.init();

  while (true) {
    // TODO: The HueApi.registeredUsers() type declaration is incorrect. Submit a PR to fix this.
    // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/node-hue-api/index.d.ts#L164
    // https://github.com/peter-murray/node-hue-api/blob/v2.3.0/hue-api/index.js#L185
    const {
      devices: users
    } = ((await hue.api.registeredUsers()) as unknown) as {
      devices: IRegisteredUser[];
    };

    const answers = await inquirer.prompt<{ user: string | IRegisteredUser }>({
      choices: users
        .map<
          | { name: string; value: IRegisteredUser }
          | string
          | inquirer.objects.Separator
        >(user => ({
          name: `${user.name} (last used ${new Date(
            user.accessed
          ).toDateString()})`,
          value: user
        }))
        .concat([new inquirer.Separator(), 'Done']),
      message: 'Registered Bridge Users',
      name: 'user',
      type: 'list'
    });

    if (answers.user === 'Done') {
      return;
    }

    await manageUser(answers.user as IRegisteredUser);
  }

  async function manageUser(user: IRegisteredUser) {
    const answers = await inquirer.prompt<{
      command: (user: IRegisteredUser) => Promise<void>;
    }>({
      choices: [
        {
          name: 'View Details',
          value: viewUserDetails
        }
      ],
      message: user.name,
      name: 'command',
      type: 'list'
    });

    await answers.command(user);
  }

  async function viewUserDetails(user: IRegisteredUser) {
    console.log(JSON.stringify(user, null, 2));
  }
}
