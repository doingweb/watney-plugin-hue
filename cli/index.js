const inquirer = require('inquirer');
const getLightsAndGroupsCli = require('./get-lights-and-groups');
const manageUsersCli = require('./manage-users');
const registerUserCli = require('./register-user');

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

module.exports = async function hueCli(app) {
  let answers = await inquirer.prompt([
    {
      name: 'command',
      message: 'What would you like to do?',
      type: 'list',
      choices: isConfigured() ? configuredChoices : unconfiguredChoices
    }
  ]);

  await answers.command(app);

  function isConfigured() {
    let { config } = app.plugins.get('hue');
    return config.host && config.username;
  }
};
