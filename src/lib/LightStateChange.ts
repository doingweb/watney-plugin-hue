export enum LightStateChange {
  /**
   * A state change for a light was requested.
   */
  Start = 'start',

  /**
   * A light's state was successfully changed.
   */
  Success = 'success',

  /**
   * There was an error changing a light's state.
   */
  Error = 'error'
}
