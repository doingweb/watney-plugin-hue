import { HueApi } from 'node-hue-api';
import { Light } from './Light';

export interface HuePluginApi {
  /**
   * The node-hue-api API object, in case one wishes to use it directly.
   *
   * @type {HueApi}
   * @memberof HuePluginApi
   */
  api: HueApi;

  /**
   * A getter that signals whether or not the plugin has been configured.
   *
   * @type {boolean}
   * @memberof HuePluginApi
   */
  isConfigured: boolean; // TODO: Should all plugins have this?

  /**
   * Get the initialized Light objects representing the named lights. Returns all lights if no names are passed.
   *
   * @param {...string[]} names
   * @returns {Light[]}
   * @memberof HuePluginApi
   */
  getLights(...names: string[]): Light[];
  // TODO: More - getLightGroups(), raw API object
}
