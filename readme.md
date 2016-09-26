# heat-templates

JavaScript generator for [OpenStack](https://github.com/openstack) [Heat](https://github.com/openstack/heat) orchestration templates. 

## Installation

```sh
$ npm i heat-templates
```

## Usage

### Simple example

Input file *template.js*

```javascript
const {Template, Server} = require('heat-templates');

const server = Server({
  name: 'foo-server',
  image: 'ubuntu',
  flavor: 'm1.small'
});

Template().add(server).printYAML();
```

Run it

```sh
$ node template.js
```

Output

```yaml
heat_template_version: '2015-04-30'
resources:
  foo-server:
    type: 'OS::Nova::Server'
    properties:
      name: foo-server
      flavor: m1.small
      image: ubuntu
```

### More complex example

Server configuration with attached volume and network port with assigned floating IP address

```javascript
const {Template, Server, Volume, Port, FloatingIP} = require('heat-templates');

const version = '2015-04-30';
const description = 'foo-template';

const template = new Template(version, description);

const server = new Server({
  name: 'foo-server',
  image: 'ubuntu',
  flavor: 'm1.small',
  keyPair: 'foo-key-pair'
});

const volume = new Volume({
  name: 'foo-volume',
  size: 512
});

server.attachVolume(volume, '/dev/vdx');

const port = new Port({
  name: 'foo-port',
  networkId: 'foo-network-id',
  subnetId: 'foo-subnet-id',
});

server.attachPort(port);

const floatingIP = new FloatingIP({
  name: 'foo-floating-ip',
  networkId: 'foo-public-network-id',
  port
});

template
  .add(server)
  .add(floatingIP)
  .printYAML();
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
      key_name: foo-key-pair
      networks:
        - port:
            get_resource: foo-port
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
  foo-port:
    type: 'OS::Neutron::Port'
    properties:
      network_id: foo-network-id
      fixed_ips:
        - subnet_id: foo-subnet-id
  foo-floating-ip:
    type: 'OS::Neutron::FloatingIP'
    properties:
      floating_network_id: foo-public-network-id
      port_id:
        get_resource: foo-port
```

## Components

The currently available components are [Server](src/server.js), [Volume](src/volume.js), [VolumeAttachment](src/volume-attachment.js), [Port](src/port.js) and [FloatingIP](src/floating-ip.js).
  
All components inherit from base [Component](src/component.js) and their constructors take properties map object as the first argument. Parameter schemas can be found in their _getSchema_ methods.  

## License
[MIT](license.md)
