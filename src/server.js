'use strict';

import Component from './component';
import VolumeAttachment from './volume-attachment';

const Server = function (properties) {
  if (!(this instanceof Server)) {
    return new Server(properties);
  }
  
  Component.call(this, properties);
};

Server.prototype = Object.create(Component.prototype);
Server.prototype.constructor = Server;

Server.prototype.attachVolume = function (volume, mountPoint) {
  const attachment = new VolumeAttachment({
    name: `${volume.properties.name}-attachment`,
    server: this,
    volume,
    mountPoint
  });

  this.dependencies.push(attachment);
};

Server.prototype.getSchema = function () {
  return {
    zone: {
      type: String
    },
    image: {
      type: String,
      required: true
    },
    flavor: {
      type: String,
      required: true
    }
  };
};

Server.prototype.getResources = function () {
  const {name, zone, flavor, image} = this.properties;

  const properties = {name, flavor, image};

  Object.assign(properties, zone ? {zone} : {});

  return {
    [name]: {
      type: 'OS::Nova::Server',
      properties
    }
  };
};

export default Server;
