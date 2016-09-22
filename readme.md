# heat-templates

JavaScript generator for [OpenStack](https://github.com/openstack) [Heat](https://github.com/openstack/heat) orchestration templates. 

## Installation

```sh
$ npm i heat-templates
```

## Usage

Simple example:

```javascript
const {Template, Server} = require('heat-templates');

const s1 = Server('server-one', {
  image: 'ubuntu',
  flavor: 'm1.small'
});

const s2 = Server('server-two', {
  image: 'debian',
  flavor: 'm1.medium',
  zone: 'nova'
});

const version = '2015-04-30';
const description = 'my heat template';

Template(version, description)
  .add(s1)
  .add(s2)
  .printYAML();

```

Prints out:

```yaml
version: '2015-04-30'
description: my heat template
resources:
  server-one:
    type: 'OS::Nova::Server'
    properties:
      name: server-one
      flavor: m1.small
      image: ubuntu
  server-two:
    type: 'OS::Nova::Server'
    properties:
      name: server-two
      flavor: m1.medium
      image: debian
      availability_zone: nova
```

## License
[MIT](license.md)
