'use strict';

const Component = function () {
  this.dependencies = [];
};

Component.prototype.getResources = function () {
  return [];
};

Component.prototype.flattenTree = function () {
  return [this, ...this.dependencies];
};

export default Component;
