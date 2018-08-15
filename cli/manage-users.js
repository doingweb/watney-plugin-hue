const inquirer = require('inquirer');
const awaitableWrap = require('../lib/awaitableWrap');

module.exports = async function manageUsersCli(app) {
  let hue = app.plugins.get('hue');

  await hue.init();

  while (true) {
    let { devices: users } = await awaitableWrap(hue.api.registeredUsers());

    let answers = await inquirer.prompt({
      name: 'user',
      message: 'Registered Bridge Users',
      type: 'list',
      choices: users
        .map(user => ({
          name: `${user.name} (last used ${new Date(
            user.accessed
          ).toDateString()})`,
          value: user
        }))
        .concat([new inquirer.Separator(), 'Done'])
    });

    if (answers.user === 'Done') {
      return;
    }

    await manageUser(answers.user);
  }

  async function manageUser(user) {
    let answers = await inquirer.prompt({
      name: 'command',
      message: user.name,
      type: 'list',
      choices: [
        {
          name: 'View Details',
          value: viewUserDetails
        },
        {
          name: 'Delete User',
          value: deleteUser
        }
      ]
    });

    await answers.command(user);
  }

  async function viewUserDetails(user) {
    console.log(JSON.stringify(user, null, 2));
  }

  async function deleteUser(user) {
    let answers = await inquirer.prompt({
      name: 'confirmed',
      message: `Are you sure you want to delete user "${user.name}" (${
        user.username
      })?`,
      type: 'confirm'
    });

    if (!answers.confirmed) {
      return;
    }

    await awaitableWrap(hue.api.deleteUser(user.username));
  }
};
