export function doTransition(callback: () => any) {
  if ("startViewTransition" in document && typeof document.startViewTransition === "function") {
    document.startViewTransition(callback);
  } else {
    callback();
  }
}
