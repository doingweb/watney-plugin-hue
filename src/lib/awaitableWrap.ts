// TODO: Is this still necessary? The @types say it uses native promises now...

/**
 * Wraps the promises used by node-hue-api in a native promise.
 *
 * @param {Object} huePromise
 * @returns {Promise} An awaitable native Promise.
 */
export function awaitableWrap<T>(huePromise: HuePromise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    huePromise
      .then(resolve)
      .fail(reject)
      .done();
  });
}

interface HuePromise<T> {
  /**
   * Attaches callbacks for the resolution of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @returns A Promise for the completion of the callback.
   */
  then(
    onfulfilled: ((value: T) => T | PromiseLike<T>) | undefined | null
  ): HuePromise<T>;

  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  fail<T>(
    onrejected?:
      | ((reason: any) => TResult | PromiseLike<TResult>)
      | undefined
      | null
  ): Promise<T | TResult>;
}
