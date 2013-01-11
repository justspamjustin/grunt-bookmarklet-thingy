/*
 * grunt-bookmarklet-thingy
 * https://github.com/justspamjustin/grunt-bookmarklet-thingy
 *
 * Copyright (c) 2013 Justin Martin
 * Licensed under the MIT license.
 */

var bookmarkletify = require('bookmarkletify');
var fs = require('fs');

module.exports = function(grunt) {

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('bookmarkletThingy', 'Builds a bookmarklet based on your provided source files.', function() {
    var bookmarkletWarnLength = 2000;
    var body = '';
    if(this.data.body) {
      body+= fs.readFileSync('./'+this.data.body);
    }

    var content = '';
    content += [
      'var numDependencies = 0,',
      '  loadedDependencies = 0;'
    ].join('\n');


    if(this.data.js) {
      content += "numDependencies += "+this.data.js.length+";\n";
    }
    if(this.data.css) {
      content += "numDependencies += "+this.data.css.length+";\n";
    }

    if(this.data.js) {
      content += [
        "var scriptUrls = "+JSON.stringify(this.data.js)+";",
        "for(var i = 0; i < scriptUrls.length; i++) {",
        "  var url = scriptUrls[i];",
        "  var script = document.createElement('script');",
        "  script.src = url;",
        "  script.type = 'text/javascript';",
        "  script.onload = scriptLoaded;",
        "  document.body.appendChild(script);",
        "}"
      ].join('\n');
    }

    if(this.data.css) {
      content += [
        "var styleUrls = "+JSON.stringify(this.data.css)+";",
        "for(var i = 0; i < styleUrls.length; i++) {",
        "  var url = styleUrls[i];",
        "  var link = document.createElement('link');",
        "  link.href = url;",
        "  link.type = 'text/css';",
        "  link.rel = 'stylesheet';",
        "  link.onload = scriptLoaded;",
        "  document.head.appendChild(link);",
        "}"
      ].join('\n');
    }

    content += [
      "function scriptLoaded() {",
      "  loadedDependencies++;",
      "  if(numDependencies === loadedDependencies) {",
      "    afterDepsLoaded();",
      "  }",
      "}",
      "function afterDepsLoaded() {",
      body,
      "}"
    ].join('\n');

    if(this.data.js && this.data.css) {
      if(this.data.js.length + this.data.css.length === 0) {
        content += "afterDepsLoaded();\n"
      }
    } else {
      content += "afterDepsLoaded();\n"
    }

    var bookmarklet = bookmarkletify(content);

    if(bookmarklet.length > bookmarkletWarnLength) {
      grunt.log.writeln("WARNING: Your bookmarklet is longer than "+bookmarkletWarnLength+" characters.  It may not work in some browsers.");
    }

    if(this.data.amdify) {
      bookmarklet = [
        "define([],function() {",
        "  return {",
        "    getBookmarklet: function() {",
        "      return '"+bookmarklet+"';",
        "    }",
        "  };",
        "});"
      ].join('\n');
      if(this.data.jshint) {
        bookmarklet = "/*jshint scripturl:true*/\n" + bookmarklet;
      }
    }

    if(this.data.out) {
      fs.writeFileSync('./'+this.data.out,bookmarklet);
    } else {
      grunt.log.writeln(bookmarklet);
    }

    return {
      getBookMarklet: function() {
        return "";
      }
    }


  });

};
