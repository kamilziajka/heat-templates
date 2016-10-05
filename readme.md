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
  server-b0df-8402:
    type: 'OS::Nova::Server'
    properties:
      flavor: m1.small
      image: ubuntu
```

### More complex example

Server configuration with attached volume and network port with assigned floating IP address

```javascript
const {Template, Server, Volume, Port, FloatingIP} = require('heat-templates');

const version = '2015-04-30';
const description = 'foo-template';

const template = Template(version, description);

const server = Server({
  id: 'foo-server',
  image: 'debian',
  flavor: 'm1.medium',
  keyPair: 'foo-key-pair'
});

const volume = Volume({
  id: 'foo-volume',
  name: 'bar-volume',
  size: 512
});

const port = Port({
  id: 'foo-port',
  network: 'foo-network',
  subnetwork: 'foo-subnetwork',
  securityGroups: ['foo-security-group']
});

const floatingIP = FloatingIP({
  id: 'foo-floating-ip',
  network: 'foo-public-network'
});

port.attachFloatingIP(floatingIP);

server.attachVolume(volume, '/dev/vdi').attachPort(port);

template.add(server).printYAML();
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
      flavor: m1.medium
      image: debian
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
      mountpoint: /dev/vdi
  foo-volume:
    type: 'OS::Cinder::Volume'
    properties:
      name: bar-volume
      size: 512
  foo-port:
    type: 'OS::Neutron::Port'
    properties:
      security_groups:
        - foo-security-group
      network: foo-network
      fixed_ips:
        - subnet: foo-subnetwork
  foo-floating-ip:
    type: 'OS::Neutron::FloatingIP'
    properties:
      port_id:
        get_resource: foo-port
      floating_network: foo-public-network
```

### Networks

Network and subnetwork connected to the external network through the router and its interface

```js
const {Template, Network, Subnetwork, Router, RouterInterface} = require('heat-templates');

const network = Network({id: 'test-net'});

const subnetwork = Subnetwork({
  id: 'test-subnet',
  cidr: '10.0.0.0/24',
  dns: ['8.8.8.8'],
  network
});

const router = Router({
  id: 'test-router',
  network: 'ext-net'
});

const routerInterface = RouterInterface({
  id: 'test-router-interface',
  subnetwork,
  router
});

Template().add(routerInterface).printYAML();
```

Output

```yaml
heat_template_version: '2015-04-30'
resources:
  test-router-interface:
    type: 'OS::Neutron::RouterInterface'
    properties:
      subnet:
        get_resource: test-subnet
      router:
        get_resource: test-router
  test-subnet:
    type: 'OS::Neutron::Subnet'
    properties:
      network:
        get_resource: test-net
      cidr: 10.0.0.0/24
      dns_nameservers:
        - 8.8.8.8
  test-net:
    type: 'OS::Neutron::Net'
  test-router:
    type: 'OS::Neutron::Router'
    properties:
      external_gateway_info:
        network: ext-net
```

## Components

The currently available components are [Server](src/server.js), [Volume](src/volume.js), [VolumeAttachment](src/volume-attachment.js), [Network](src/network.js), [Subnetwork](src/subnetwork.js), [Port](src/port.js), [FloatingIP](src/floating-ip.js), [Router](src/router.js), [RouterInterface](src/router-interface.js) and [SecurityGroup](src/security-group.js).

All components inherit from base [Component](src/component.js) and their constructors take properties map object as the first argument. Parameter schemas can be found in their _getSchema_ methods.
  
Already existing resources can be referenced using strings with their OpenStack IDs.
  
Library works even on [node](https://nodejs.org) 0.8 but requires ES6 _Object.assign_ and _Set_ polyfills.

## Launching stacks

One of the ways to launch a stack is to use an OpenStack client (python-openstackclient===2.3.0 from pip) 

```sh
$ node template.js > template.yaml
$ openstack stack create -t template.yaml test-stack
```

## License
[MIT](license.md)
