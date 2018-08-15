/**
 * CLI function that prints out the names of all the Hue lights and lights groups.
 *
 * Useful as a reference when designing Watney scripts.
 *
 * @param {WatneyApp} app
 */
module.exports = async function getLightsAndGroupsCli(app) {
  let hue = app.plugins.get('hue');

  await hue.init();

  let lightNames = Array.from(hue.lights.keys());
  let groupNames = Array.from(hue.lightGroups.keys());

  console.log('Lights', JSON.stringify(lightNames, null, 2));
  console.log('Groups', JSON.stringify(groupNames, null, 2));
};
