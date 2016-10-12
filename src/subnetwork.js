'use strict';

import Component from './component';
import Network from './network';
import Port from './port';

const Subnetwork = function (properties) {
  if (!(this instanceof Subnetwork)) {
    return new Subnetwork(properties);
  }

  Component.call(this, {
    dns: [],
    ...properties
  });
};

Subnetwork.prototype = Object.create(Component.prototype);
Subnetwork.prototype.constructor = Subnetwork;

Subnetwork.prototype.createPort = function (properties) {
  const {network} = this.properties;
  const subnetwork = this;

  return Port({
    network,
    subnetwork,
    ...properties
  });
};

Subnetwork.prototype.getDependencies = function () {
  return [
    ...this.dependencies,
    this.properties.network
  ]
};

Subnetwork.prototype.getSchema = function () {
  return {
    network: {
      type: [String, Network],
      required: true
    },
    cidr: {
      type: String,
      required: true
    },
    name: String,
    dns: {
      type: Array,
      items: String
    }
  };
};

Subnetwork.prototype.getResources = function () {
  const {id, network, name, cidr, dns} = this.properties;

  const properties = {
    network: Component.resolve(network)
  };

  Object.assign(
    properties,
    name ? {name} : {},
    cidr ? {cidr} : {},
    dns.length ? {dns_nameservers: dns} : {}
  );

  return {
    [id]: {
      type: 'OS::Neutron::Subnet',
      properties
    }
  };
};

export default Subnetwork;
