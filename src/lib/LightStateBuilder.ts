import { lightState } from 'node-hue-api';

export class LightStateBuilder {
  public static getOnState(brightness?: number, transitionSeconds?: number) {
    let state = lightState.create().on();

    if (brightness !== undefined) {
      state = state.bri(brightness * 254);
    }

    if (transitionSeconds !== undefined) {
      state = state.transitiontime(transitionSeconds * 10);
    }

    return state;
  }

  public static getOffState(transitionSeconds?: number) {
    let state = lightState.create().off();

    if (transitionSeconds !== undefined) {
      state = state.transitiontime(transitionSeconds * 10);
    }

    return state;
  }
}
