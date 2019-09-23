// Load dependencies.
const _ = require('lodash');
const path = require('path');

// Export grunt tasks.
module.exports = (grunt) => {

  // Configures source folder structure.
  const src = [
    {folder: '01-blocks', exts: ['.xml', '.yaml']},
    {folder: '02-templates', exts: ['.xml']},
    {folder: '03-formats', exts: ['.vm']},
    {folder: '04-data-definitions', exts: ['.xml']},
    {folder: '05-metadata-sets', exts: ['.yaml']},
    {folder: '06-configurations', exts: ['.yaml']},
    {folder: '07-base-assets', exts: ['.xml', '.yaml']},
    {folder: '08-asset-factories', exts: ['.xml', '.yaml']},
  ];

  // Helps configuring sources for assemble.
  const assemble = ( dir, ext ) => {

    return _.set({}, `${dir}-${_.trimStart(ext, '.')}`, {
      options: {
        ext,
        partials: [
          `src/${dir}/**/_includes/**/*.{xml,vm,yaml}`,
          `src/${dir}/**/layouts/**/*.{xml,vm,yaml}`
        ],
        layoutdir: `src/${dir}/layouts/`
      },
      files: [{
        expand: true,
        cwd: 'src/',
        src: [
          `${dir}/**/*`,
          `!${dir}/**/_includes/**/*`
        ],
        dest: 'dist/',
        nodir: true
      }]
    });

  };

  // Configure tasks.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    src,

    assemble: _.merge({
      options: {
        helpers: [
          'handlebars-helpers',
          'handlebars-layouts',
          'src/00-config/helpers/**/*.js'
        ],
        plugins: [],
      }
    }, _.reduce(src, (result, source) => {

      // Build the configurations for the source folder and its respective file extensions.
      const config = _.reduce(source.exts, (config, ext) => _.merge(config, assemble(source.folder, ext)), {});

      // Continue building the configurations.
      return _.merge(result, config);

    }, {})),
    watch: {
      src: {
        files: [
          'src/**/*'
        ],
        tasks: ['build']
      },
      config: {
        options: {
          reload: true
        },
        files: [
          'Gruntfile.js',
          'package.json'
        ]
      }
    },
    clean: {
      dist: 'dist/'
    },
    'xml-formatter': {
      dist: {
        options: {
          indentation: '  ',
          stripComments: true,
          collapseContent: true
        },
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['**/*.xml'],
          dest: 'dist/'
        }]
      }
    },
    // TODO: Add a grunt task to remove extraneous whitespace from XML files.
  });

  // Load tasks.
  require('load-grunt-tasks')(grunt);

  // Register tasks.
  grunt.registerTask('default', ['dev']);
  grunt.registerTask('build', ['assemble', 'xml-formatter', 'uglify']);
  grunt.registerTask('dev', ['clean', 'build', 'watch']);
  grunt.registerTask('dist', ['clean', 'build']);


};
