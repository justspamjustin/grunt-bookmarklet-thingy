/*
 * grunt-bookmarklet-thingy
 * https://github.com/justspamjustin/grunt-bookmarklet-thingy
 *
 * Copyright (c) 2013 Justin Martin
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/cowboy/grunt/blob/master/docs/toc.md

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerTask('bookmarklet-thingy', 'Your task description goes here.', function() {
    grunt.log.write(grunt.helper('bookmarklet-thingy'));
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  grunt.registerHelper('bookmarklet-thingy', function() {
    return 'bookmarklet-thingy!!!';
  });

};
