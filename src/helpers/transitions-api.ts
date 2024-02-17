type ViewTransition<T> = {
  ready: Promise<void>;
  finished: Promise<void>;
  updateCallbackDone: Promise<T>;
};

export function doTransition<T>(callback: () => any | Promise<T>): ViewTransition<T> {
  if ("startViewTransition" in document && typeof document.startViewTransition === "function") {
    return document.startViewTransition(callback) as ViewTransition<T>;
  } else {
    const promise = (async () => callback())();
    return {
      ready: Promise.resolve(),
      updateCallbackDone: promise,
      finished: new Promise((resolve) => promise.finally(resolve)),
    };
  }
}
