const awaitableWrap = require('./awaitableWrap');
const {
  LIGHT_STATE_CHANGE_START,
  LIGHT_STATE_CHANGE_SUCCESS,
  LIGHT_STATE_CHANGE_ERROR
} = require('./events');
const Light = require('./Light');

/** @typedef {{ on: boolean, bri: number }} LightState */

/**
 * A group of lighting devices (e.g., a light fixture or room).
 *
 * @class LightGroup
 */
module.exports = class LightGroup extends Light {
  /**
   * Sets the state of the light group.
   *
   * @param {LightState} state A light state object generated by node-hue-api.
   */
  async setState(state) {
    this.emit(LIGHT_STATE_CHANGE_START, state);

    try {
      await awaitableWrap(this.api.setGroupLightState(this.id, state));

      this.emit(LIGHT_STATE_CHANGE_SUCCESS, state);
    } catch (error) {
      this.emit(LIGHT_STATE_CHANGE_ERROR, error);
    }
  }

  /**
   * Gets the last action applied to the light group.
   *
   * @returns {Promise<LightState>} A light state object from node-hue-api.
   */
  async getState() {
    let group = await awaitableWrap(this.api.getGroup(this.id));
    return group.lastAction;
  }
};
