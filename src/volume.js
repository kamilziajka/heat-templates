'use strict';

import Component from './component';

const Volume = function (properties) {
  if (!(this instanceof Volume)) {
    return new Volume(properties);
  }

  Component.call(this, properties);
};

Volume.prototype = Object.create(Component.prototype);
Volume.prototype.constructor = Volume;

Volume.prototype.getSchema = function () {
  return {
    size: {
      type: Number,
      required: true
    }
  };
};

Volume.prototype.getResources = function () {
  const {name, size} = this.properties;

  const resource = {
    type: 'OS::Cinder::Volume',
    properties: {name, size}
  };

  return {[name]: resource};
};

export default Volume;
