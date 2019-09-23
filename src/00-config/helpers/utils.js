// Load dependencies.
const _ = require('lodash');
const kind = require('kind-of');

// Register utility helpers.
module.exports = {

  kindOf: ( value ) => kind(value)

};
