module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    test: {
      files: ['test/**/*.js']
    },
    lint: {
      files: ['grunt.js', 'tasks/**/*.js', 'test/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        es5: true
      },
      globals: {}
    },
    bookmarklet: {
      generate: {
        js: ['http://code.jquery.com/jquery-1.8.1.min.js','http://code.jquery.com/jquery-1.8.3.js'],
        jsIds: ['jquery-min','jquery'],
        css: ['http://static.jquery.com/files/rocker/css/reset.css'],
        body: 'test.js',
        out: 'bookmarklet.js',
        amdify: true,
        jshint: true,
        timestamp: true
      }
    }
  });

  // Load local tasks.
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', 'lint test');

};
