'use strict';

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
    networkId: {
      type: String,
      required: true
    },
    port: {
      type: Port,
      required: true
    }
  };
};

FloatingIP.prototype.getResources = function () {
  const {name, networkId, port} = this.properties;

  const resource = {
    type: 'OS::Neutron::FloatingIP',
    properties: {
      floating_network_id: networkId,
      port_id: port.getId()
    }
  };

  return {[name]: resource};
};

export default FloatingIP;
