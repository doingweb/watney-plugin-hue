const { WatneyPlugin } = require('watney-app');
const { HueApi } = require('node-hue-api');
const awaitableWrap = require('./lib/awaitableWrap');
const events = require('./lib/events');
const LightGroup = require('./lib/LightGroup');
const Light = require('./lib/Light');

const {
  LIGHT_STATE_CHANGE_START,
  LIGHT_STATE_CHANGE_SUCCESS,
  LIGHT_STATE_CHANGE_ERROR
} = events;

module.exports = class HuePlugin extends WatneyPlugin {
  static get id() {
    return 'hue';
  }

  static get description() {
    return 'Plugin for the Philips Hue lighting system.';
  }

  static get cli() {
    return require('./cli');
  }

  get events() {
    return events;
  }

  constructor(config) {
    super(config);

    let { host, username } = this.config;
    this.api = new HueApi(host, username);

    this.logger.log('Plugin has been constructed.');
  }

  async init() {
    await Promise.all([this.buildLightGroupMap(), this.buildLightMap()]);

    this.setUpLightLogging();

    await super.init();
  }

  getLightGroups(...names) {
    return names.map(name => this.lightGroups.get(name));
  }

  getLights(...names) {
    return names.map(name => this.lights.get(name));
  }

  async buildLightGroupMap() {
    let rawGroups = await awaitableWrap(this.api.groups());
    let lightGroupArray = rawGroups.map(g => new LightGroup(g, this.api));

    this.lightGroups = new Map(lightGroupArray.map(g => [g.name, g]));
  }

  async buildLightMap() {
    let { lights: rawLights } = await awaitableWrap(this.api.lights());
    let lightArray = rawLights.map(l => new Light(l, this.api));

    this.lights = new Map(lightArray.map(l => [l.name, l]));
  }

  setUpLightLogging() {
    for (const group of this.lightGroups.values()) {
      group.on(LIGHT_STATE_CHANGE_START, state =>
        this.logger.log(
          `Changing state of light group ${group.id} to ${JSON.stringify(
            state
          )}.`
        )
      );

      group.on(LIGHT_STATE_CHANGE_SUCCESS, state =>
        this.logger.log(`Light group ${group.id} state successfully changed.`)
      );

      group.on(LIGHT_STATE_CHANGE_ERROR, error =>
        this.logger.log(
          `Error changing state of light group ${group.id}: ${error}`
        )
      );
    }

    for (const light of this.lights.values()) {
      light.on(LIGHT_STATE_CHANGE_START, state =>
        this.logger.log(
          `Changing state of light ${light.id} to ${JSON.stringify(state)}.`
        )
      );

      light.on(LIGHT_STATE_CHANGE_SUCCESS, state =>
        this.logger.log(`Light ${light.id} state successfully changed.`)
      );

      light.on(LIGHT_STATE_CHANGE_ERROR, error =>
        this.logger.log(`Error changing state of light ${light.id}: ${error}`)
      );
    }
  }
};
