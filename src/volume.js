'use strict';

import Component from './component';

const Volume = function (...args) {
  if (!(this instanceof Volume)) {
    return new Volume(...args);
  }

  Component.call(this, ...args);
};

Volume.prototype = Object.create(Component.prototype);
Volume.prototype.constructor = Volume;

Volume.prototype.getTemplates = () => ({
  name: ({name}) => name,
  type: 'OS::Cinder::Volume',
  properties: {
    name: {
      type: 'string',
      required: true,
      value: ({name}) => name
    },
    availability_zone: {
      type: 'string',
      required: false,
      value: ({properties: {zone}}) => zone
    },
    size: {
      type: 'number',
      required: true,
      value: ({properties: {size}}) => size
    }
  }
});

export default Volume;
