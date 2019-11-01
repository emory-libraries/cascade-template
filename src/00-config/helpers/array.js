// Load dependencies.
const _ = require('lodash');

// Export helpers.
module.exports = {

  // Filter an array for some value.
  filter: ( array, value ) => [true, false].includes(value) ? _.filter(array, (item) => item === value) : _.filter(array, value)

};
