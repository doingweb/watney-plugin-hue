import { EventEmitter } from 'events';
import { lightState } from 'node-hue-api';
import { LightState } from './LightState';

export interface Light extends EventEmitter {
  readonly id: string;
  readonly name: string;

  /**
   * Turn on the light, optionally with some transition time.
   *
   * @param {number} [transitionSeconds] The length of time in seconds to to fade the light in.
   * @returns {Promise<void>}
   * @memberof Light
   */
  turnOn(transitionSeconds?: number): Promise<void>;

  /**
   * Turns off the light.
   *
   * @param {number} [transitionSeconds] The length of time in seconds to to fade the light off.
   * @returns {Promise<void>}
   * @memberof Light
   */
  turnOff(transitionSeconds?: number): Promise<void>;

  /**
   * Set the brightness of the light. Will turn on the light of the value is greater than zero.
   *
   * @param {number} value A decimal value from 0 to 1, representing how bright to set the light. Values above 1 are treated as 1.
   * @param {number} [transitionSeconds] The length of time in seconds to to fade the light in.
   * @returns {Promise<void>}
   * @memberof Light
   */
  setBrightness(value: number, transitionSeconds?: number): Promise<void>;

  getState(): Promise<LightState>;
  setState(state: LightState | lightState.State): Promise<void>;
}
