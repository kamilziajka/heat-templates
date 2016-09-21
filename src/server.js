'use strict';

import Component from './component';

const Server = function (name) {
  Component.call(this);
  this.name = name;
};

Server.prototype = Object.create(Component.prototype);
Server.prototype.constructor = Server;

Server.prototype.getResources = function () {
  const {name} = this;
  return [{name}];
};

export default Server;
