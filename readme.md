# heat-templates

JavaScript generator for [OpenStack](https://github.com/openstack) [Heat](https://github.com/openstack/heat) orchestration templates. 

## Installation

```sh
$ npm i heat-templates
```

## Usage

Simple *template.js*

```javascript
const {Template, Server, Volume} = require('heat-templates');

const server = Server({
  name: 'foo-server',
  image: 'ubuntu',
  flavor: 'm1.small'
});

const volume = Volume({
  name: 'foo-volume',
  size: 512
});

server.attachVolume(volume, '/dev/vdx');

const version = '2015-04-30';
const description = 'foo-template';

Template(version, description).add(server).printYAML();
```

Run it

```sh
$ node template.js
```

Output

```yaml
heat_template_version: '2015-04-30'
description: foo-template
resources:
  foo-server:
    type: 'OS::Nova::Server'
    properties:
      name: foo-server
      flavor: m1.small
      image: ubuntu
  foo-volume-attachment:
    type: 'OS::Cinder::VolumeAttachment'
    properties:
      volume_id:
        get_resource: foo-volume
      instance_uuid:
        get_resource: foo-server
      mountpoint: /dev/vdx
  foo-volume:
    type: 'OS::Cinder::Volume'
    properties:
      name: foo-volume
      size: 512
```

## Components

The currently available components are [Server](src/server.js), [Volume](src/volume.js) and [VolumeAttachment](src/volume-attachment.js).
  
All components inherit from base [Component](src/component.js) and their constructors take parameters map object as the first argument. Parameter schemas can be found in their _getSchema_ method.  

## License
[MIT](license.md)
