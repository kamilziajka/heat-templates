'use strict';

import Component from './component';
import VolumeAttachment from './volume-attachment';

const Server = function (...args) {
  if (!(this instanceof Server)) {
    return new Server(...args);
  }
  
  Component.call(this, ...args);
};

Server.prototype = Object.create(Component.prototype);
Server.prototype.constructor = Server;

Server.prototype.attachVolume = function (volume, mountPoint) {
  const name = `${volume.name}-attachment`;

  const properties = {
    server: this,
    volume,
    mountPoint
  };

  const volumeAttachment = VolumeAttachment(name, properties);

  this.addDependencies(volume, volumeAttachment);
};

Server.prototype.getTemplates = () => ({
  name: ({name}) => name,
  type: 'OS::Nova::Server',
  properties: {
    name: {
      type: 'string',
      required: true,
      value: ({name}) => name
    },
    flavor: {
      type: 'string',
      required: true,
      value: ({properties: {flavor}}) => flavor
    },
    image: {
      type: 'string',
      required: true,
      value: ({properties: {image}}) => image
    },
    availability_zone: {
      type: 'string',
      required: false,
      value: ({properties: {zone}}) => zone
    }
  }
});

export default Server;
