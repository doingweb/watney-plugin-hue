import { HueApi } from 'node-hue-api';
import {
  PluginCommandLineInterface,
  PluginConfig,
  WatneyPluginBase
} from 'watney-app';
import { hueCli } from '../cli';
import { HueLight } from './HueLight';
import { HuePluginApi } from './HuePluginApi';
import { HuePluginConfig } from './HuePluginConfig';
import { Light } from './Light';
import LightGroup from './LightGroup';
import { LightStateChange } from './LightStateChange';

export class HuePlugin extends WatneyPluginBase implements HuePluginApi {
  static get id() {
    return 'hue';
  }

  static get description() {
    return 'Plugin for the Philips Hue lighting system.';
  }

  public get isConfigured() {
    return !!(this.config.host && this.config.username);
  }
  public readonly cli: PluginCommandLineInterface = hueCli;
  public api: HueApi;

  protected readonly config!: HuePluginConfig;
  private lights!: Map<string, Light>;

  constructor(config: PluginConfig) {
    super(config);

    this.api = new HueApi(this.config.host, this.config.username);

    this.logger.log('Plugin has been constructed.');
  }

  public async init() {
    await Promise.all([this.buildLightMap(), this.buildLightGroupMap()]);
    this.setUpLightLogging();
  }

  public getLights(...names: string[]) {
    if (!names.length) {
      return Array.from(this.lights.values()).filter(light => light);
    }

    return names
      .map(name => this.lights.get(name))
      .filter(light => light) as Light[];
  }

  // public getLightGroups(...names) {
  //   return names.map(name => this.lightGroups.get(name));
  // }

  private async buildLightMap() {
    const { lights } = await this.api.lights();
    const lightArray: Light[] = lights.map(l => new HueLight(l, this.api));
    this.lights = new Map(lightArray.map<[string, Light]>(l => [l.name, l]));
  }

  private async buildLightGroupMap() {
    // const rawGroups = await this.api.groups();
    // const lightGroupArray = rawGroups.map(g => new LightGroup(g, this.api));
    // this.lightGroups = new Map(lightGroupArray.map(g => [g.name, g]));
  }

  private setUpLightLogging() {
    for (const light of this.lights.values()) {
      light.on(LightStateChange.Start, state =>
        this.logger.log(
          `Changing state of light ${light.id} to ${JSON.stringify(state)}.`
        )
      );
      light.on(LightStateChange.Success, state =>
        this.logger.log(`Light ${light.id} state successfully changed.`)
      );
      light.on(LightStateChange.Error, error =>
        this.logger.log(`Error changing state of light ${light.id}: ${error}`)
      );
    }

    // for (const group of this.lightGroups.values()) {
    //   group.on(LIGHT_STATE_CHANGE_START, state => this.logger.log(`Changing state of light group ${group.id} to ${JSON.stringify(state)}.`));
    //   group.on(LIGHT_STATE_CHANGE_SUCCESS, state => this.logger.log(`Light group ${group.id} state successfully changed.`));
    //   group.on(LIGHT_STATE_CHANGE_ERROR, error => this.logger.log(`Error changing state of light group ${group.id}: ${error}`));
    // }
  }
}
