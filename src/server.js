'use strict';

import Component from './component';

const Server = function (...args) {
  Component.call(this, ...args);
};

Server.prototype = Object.create(Component.prototype);
Server.prototype.constructor = Server;

Server.prototype.templates = {
  name: ({name}) => name,
  type: 'OS::Nova::Server',
  properties: {
    name: {
      type: 'string',
      required: 'true',
      value: ({name}) => name
    }
  }
};

export default Server;
