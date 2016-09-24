'use strict';

export const getPrototypeChain = (obj) => {
  const prototype = Object.getPrototypeOf(obj);

  return Object.keys(prototype).length ?
    [prototype, ...getPrototypeChain(prototype)] :
    [];
};
