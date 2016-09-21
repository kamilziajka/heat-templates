'use strict';

import Yaml from 'js-yaml';

const Template = function (
  version = '2015-04-30',
  description = ''
) {
  Object.assign(this, {version, description});
  this.components = [];
};

Template.prototype.add = function (component) {
  this.components.push(component);
  return this;
};

Template.prototype.toHeat = function () {
  const {version, description, components} = this;

  const heat = {version};

  if (description && description.length) {
    template.description = description;
  }

  heat.resources = components
    .map(component => component.getResources())
    .reduce((current, next) => current.concat(next), [])
    .reduce((current, next) => ({...current, [next.name]: next}), {});

  return heat;
};

Template.prototype.toJSON = function () {
  return JSON.stringify(this.toHeat(), null, 2);
};

Template.prototype.toYAML = function () {
  return Yaml.dump(this.toHeat());
};

export default Template;
