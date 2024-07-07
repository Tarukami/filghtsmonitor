const isPromiseFullfilled = <T>(promiseResult: PromiseSettledResult<T>): promiseResult is PromiseFulfilledResult<T> => {
  return promiseResult.status === "fulfilled";
};

export { isPromiseFullfilled };
