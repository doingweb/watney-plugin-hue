import { ColorMode, LightAlert, LightEffect } from 'node-hue-api';

/**
 * The `state` of an `ILight`. Defined here because it is not explicitly exported by the node-hue-api types package.
 *
 * @export
 * @interface LightState
 */
export interface LightState {
  rgb?: number[];
  on: boolean;
  bri: number;
  hue?: number;
  sat?: number;
  xy?: [number, number];
  ct?: number;
  alert: LightAlert;
  effect?: LightEffect;
  colormode?: ColorMode;
  reachable: boolean;
}
