'use strict';

import Schema from 'schema-js';
import Component from './component';
import Port from './port';

const FloatingIP = function (properties) {
  if (!(this instanceof FloatingIP)) {
    return new FloatingIP(properties);
  }

  Component.call(this, properties);
};

FloatingIP.prototype = Object.create(Component.prototype);
FloatingIP.prototype.constructor = FloatingIP;

FloatingIP.prototype.getDependencies = function () {
  return [
    ...this.dependencies,
    this.properties.port
  ]
};

FloatingIP.prototype.getSchema = function () {
  return {
    network: {
      type: String,
      required: true
    },
    port: {
      type: [String, Port],
      required: true
    }
  };
};

FloatingIP.prototype.getResources = function () {
  const {id, network, port} = this.properties;

  const resource = {
    type: 'OS::Neutron::FloatingIP',
    properties: {
      floating_network: network,
      port_id: Component.resolve(port)
    }
  };

  return {[id]: resource};
};

export default FloatingIP;
