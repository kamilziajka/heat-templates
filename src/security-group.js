'use strict';

import Component from './component';

const SecurityGroup = function (properties) {
  if (!(this instanceof SecurityGroup)) {
    return new SecurityGroup(properties);
  }

  Component.call(this, properties);
};

SecurityGroup.prototype = Object.create(Component.prototype);
SecurityGroup.prototype.constructor = SecurityGroup;

SecurityGroup.prototype.getSchema = function () {
  return {
    name: String,
    description: String,
    rules: {
      type: Array,
      items: {
        direction: String,
        ethernetType: String,
        from: Number,
        to: Number,
        protocol: String
      }
    }
  };
};

SecurityGroup.prototype.getResources = function () {
  const {id, name, description} = this.properties;

  const rules = this.properties.rules.map((rule) => {
    const {direction, ethernetType, from, to, protocol} = rule;

    return Object.assign(
      {},
      direction ? {direction} : {},
      ethernetType ? {ethertype: ethernetType} : {},
      from ? {port_range_min: from} : {},
      to ? {port_range_max: to} : {},
      protocol ? {protocol} : {}
    );
  });

  const properties = Object.assign(
    {},
    name ? {name} : {},
    description ? {description} : {},
    rules.length ? {rules} : {}
  );

  return {
    [id]: {
      type: 'OS::Neutron::SecurityGroup',
      properties
    }
  };
};

export default SecurityGroup;
