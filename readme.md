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

const server = Server('foo-server', {
  image: 'ubuntu',
  flavor: 'm1.small'
});

const volume = Volume('foo-volume', {size: 512});

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
version: '2015-04-30'
description: foo-template
resources:
  foo-server:
    type: 'OS::Nova::Server'
    properties:
      name: foo-server
      flavor: m1.small
      image: ubuntu
  foo-volume:
    type: 'OS::Cinder::Volume'
    properties:
      name: foo-volume
      size: 512
  foo-volume-attachment:
    type: 'OS::Cinder::VolumeAttachment'
    properties:
      volume_id:
        get_resource: foo-volume
      instance_id:
        get_resource: foo-server
      mountpoint: /dev/vdx
```

## License
[MIT](license.md)
