/*
 * grunt-als-build
 * https://github.com/asizer/grunt-als-build
 *
 * Copyright (c) 2015 Alison Sizer
 * Licensed under the MIT license.
 */

var _ = require('lodash');

module.exports = function(grunt) {
  'use strict';

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('als_build', 'Concatenate and minify all javascript files and html templates into a single, dojo-readable file', function() {

    // this plugin is just an extension of concat.
    require('grunt-contrib-concat/tasks/concat.js')(grunt);
    grunt.renameTask('concat', 'als_build_concat');

    var tally = {
      js: 0,
      html: 0
    };

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      banner: 'require({\ncache: {\n',
      footer: '\n}});\n(function(){ require({cache:{}}); })();',
      separator: ',' + grunt.util.linefeed,
      minify: true,
      process: function(src, filepath) {
        var returnStr = '\n// Source: ' + filepath + '\n';

        // replace path name with package name.
        var pkgs = this.pkgs;
        for (var key in pkgs) {
          if (pkgs.hasOwnProperty(key)) {
            if (filepath.indexOf(pkgs[key]) === 0) {
              filepath = key + filepath.replace(pkgs[key], '');
              break;
            }
          }
        }
        // process file
        if (filepath.indexOf('.js', filepath.length - 3) >= 0) {
          tally.js++;
          // add file name, then file text as contents of function() {}
          returnStr += '\'' + filepath.replace('.js', '') + '\': ' +
            'function() {\n' + src + '\n}';
        } else if (filepath.indexOf('.html', filepath.length - 5) >= 0) {
          tally.html++;
          // check for and warn about single quotes.
          if (src.indexOf('\'') >= 0) {
            console.warn('The template file ' + filepath + ' contains single quotes. This might break the build.');
          }
          // add file name as url, then html template, leaving a single space for newlines and tabs.
          // also try escaping single quote.
          returnStr += '\'url:' + filepath + '\': ' +
            '\'' + src.replace(/\r+\s*/g, ' ').replace(/\n+\s*/g, ' ').replace(/\'/g, '\\\'') + '\'';
        } else {
          console.error('uh oh! ' + filepath + ' fell through');
          return;
        }
        return returnStr;        
      }
    });

    var config = {
      main: {
        options: options,
        files: this.files
      }
    };

    grunt.config.set('als_build_concat', config);

    grunt.task.run('als_build_concat');

    console.log('tally?', tally);

    // minify files
    require('grunt-contrib-uglify/tasks/uglify.js')(grunt);
    grunt.renameTask('uglify', 'als_build_uglify');

    var uglifyFiles = _.map(this.files, function(x) {
      return {
        src: x.dest,
        dest: x.dest 
      };
    });

    grunt.config.set('als_build_uglify', {
      main: {
        files: uglifyFiles
      }
    });

    grunt.task.run('als_build_uglify');


  });

};
