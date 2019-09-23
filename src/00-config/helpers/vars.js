// Load dependencies.
const _ = require('lodash');

// Register variable helpers.
module.exports = {

  // Set a context variable.
  set( key, value, options ) {

    // Set a value on the context.
    if( options.fn ) _.set(this, key, value);

  },

  // Unset a context variable.
  unset( key, options ) {

    // Unset a value on the context.
    if( options.fn ) _.unset(this, key);

  },

  // Create an object from the given options hash.
  object: ( options ) => _.get(options, 'hash', {}),

  // Create an array from the given arguments.
  array: ( ...values ) => _.initial(values),

  // Use the scoped variables as the defaults for the current context.
  use( scope, options ) {

    // Capture any current contexts that should be included in the scoped context.
    let includes = _.get(options, 'hash.with', []);

    // Always make sure the included contexts are in array form.
    if( !_.isArray(includes) ) includes = [includes];

    // Always prefer to use data from the root context.
    const root = _.get(this, '__use__.root', this);

    // Save the root context's data if not already saved.
    if( !_.has(this, '__use__.root') ) _.set(this, '__use__.root', root);

    // Get the scoped variables.
    let scoped = _.get(this, scope, this);

    // Merge any included contexts into the scoped context.
    _.each(includes, (include) => {

      // Initialize the included context.
      const included = {};

      // Capture the included context.
      included[include] = _.get(this, include, {});

      // Merge the included context into the scoped context.
      scoped = _.merge(scoped, included);

    });

    // Save the scope to the context's data.
    _.set(this, `__use__.${scope}`, scoped);

    // Initialize the new context with the defaults set to the scoped variables.
    const context = _.merge({}, scoped, root);

    // Render the block with the new context that has the scoped variables merged.
    return options.fn ? options.fn(context) : context;

  }

};
