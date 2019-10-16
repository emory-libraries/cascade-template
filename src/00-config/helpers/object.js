// Load dependencies.
const _ = require('lodash');

// Export helpers.
module.exports = {

  // Get keys from an object.
  keys: ( object ) => _.keys(object),

  // Get values from an object.
  values: ( object ) => _.values(object)

};
