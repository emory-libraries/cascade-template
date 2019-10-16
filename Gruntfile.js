// Load dependencies.
const _ = require('lodash');
const path = require('path');
const pretty = require('prettify-xml');

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
  const compile = ( dir, ext ) => {

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
          'src/00-config/helpers/**/*.js'
        ],
        plugins: [],
      }
    }, _.reduce(src, (result, source) => {

      // Build the configurations for the source folder and its respective file extensions.
      const config = _.reduce(source.exts, (config, ext) => _.merge(config, compile(source.folder, ext)), {});

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
        ],
        tasks: ['build']
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
  grunt.registerTask('prettify', 'Prettify XML by removing extra whitespace', function() {

    // Get files to prettify.
    const files = grunt.file.expand('dist/**/*.xml');

    // Initialize a utility method for prettifying XML content.
    const prettify = (xml) => {

      // Remove empty lines.
      xml = xml.replace(/^\s*$/gm, '');

      // Collapse multiple line breaks to a single line break.
      xml = xml.replace(/\n{2,}/g, '\n');

      // Initialize helper regexes.
      const regex = {
        attr: /([a-z:-]+=")((?:[\s\S])*?)(")/g,
        node: /(<[a-z-:]+ )(.*?)(\/?>)/g
      };

      // Initialize helper variables.
      let attr, node;

      // Remove extra whitespace in attributes one by one.
      while( !_.isNil(attr = regex.attr.exec(xml)) ) {

        // Remove extra whitespace from the attribute value.
        attr[2] = attr[2].replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').trim();

        // Save the cleaned attribute.
        xml = xml.replace(attr[0], `${attr[1]}${attr[2]}${attr[3]}`);

      }

      // Remove extra whitespace from nodes one by one.
      while( !_.isNil(node = regex.node.exec(xml)) ) {

        // Remove extra whitespace from the node.
        node[2] = node[2].replace(/\s{2,}/g, ' ').trim();

        // Save the cleaned node.
        xml = xml.replace(node[0], `${node[1]}${node[2]}${node[3]}`);

      }

      // Pretty print the XML, and return it.
      return pretty(xml, {
        indent: 2,
        newline: '\n'
      });

    };

    // Prettify each file.
    _.each(files, (file) => {

      // Read the file's contents.
      let contents = grunt.file.read(file);

      // Prettify the file's contents.
      contents = prettify(contents);

      // Save the file with its prettified contents.
      grunt.file.write(file, contents);

    });

    // Output a success message.
    grunt.log.ok(`${files.length} files prettified.`);

  });
  grunt.registerTask('build', ['assemble', 'xml-formatter', 'prettify']);
  grunt.registerTask('dev', ['clean', 'build', 'watch']);
  grunt.registerTask('dist', ['clean', 'build']);


};
