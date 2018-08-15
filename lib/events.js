/**
 * A state change for a light was requested.
 */
module.exports.LIGHT_STATE_CHANGE_START = Symbol('light change start');

/**
 * A light's state was successfully changed.
 */
module.exports.LIGHT_STATE_CHANGE_SUCCESS = Symbol('light changed');

/**
 * There was an error changing a light's state.
 */
module.exports.LIGHT_STATE_CHANGE_ERROR = Symbol('light change error');
