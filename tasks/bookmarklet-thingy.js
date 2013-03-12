// Generated by CoffeeScript 1.3.3
(function() {
  var bookmarkletWarnLength, bookmarkletify, fs;

  bookmarkletify = require("bookmarkletify");

  fs = require("fs");

  bookmarkletWarnLength = 2000;

  module.exports = function(grunt) {
    return grunt.registerMultiTask("bookmarklet", "Builds a bookmarklet based on your provided source files.", function() {
      var amdifyBookmarklet, body, bookmarklet, checkBookmarkletLength, content, getBody, getContent, host, hostMacro, outputBookmarklet, timestamp,
        _this = this;
      timestamp = (this.data.timestamp ? " + '?t=' + Date.now()" : '');
      hostMacro = '__HOST__';
      host = (this.data.host && this.data.amdify ? "'" + hostMacro + "' + " : '');
      getBody = function() {
        var body;
        body = '';
        if (_this.data.body) {
          body += fs.readFileSync("./" + _this.data.body);
        }
        return body;
      };
      getContent = function(body) {
        var content;
        content = '';
        content += "var numDependencies = 0,\n    loadedDependencies = 0;";
        if (_this.data.js) {
          content += "numDependencies += " + _this.data.js.length + ";\n";
        }
        if (_this.data.css) {
          content += "numDependencies += " + _this.data.css.length + ";\n";
        }
        if (_this.data.js) {
          content += "var scriptUrls = " + (JSON.stringify(_this.data.js)) + ";\n" + ((function() {
            if (this.data.jsIds) {
              if (this.data.jsIds.length !== this.data.js.length) {
                throw new Error("You must provide the same number of IDs as scripts");
              }
              return "var scriptIds = " + (JSON.stringify(this.data.jsIds)) + ";";
            } else {
              return "";
            }
          }).call(_this)) + "\nfor(var i = 0; i < scriptUrls.length; i++) {\n  var url = scriptUrls[i];\n  var script = document.createElement('script');\n  script.src = " + host + "url" + timestamp + ";\n  " + (_this.data.jsIds ? "script.id = scriptIds[i];" : "") + "\n  script.type = 'text/javascript';\n  script.onload = scriptLoaded;\n  document.body.appendChild(script);\n}";
        }
        if (_this.data.css) {
          content += "var styleUrls = " + (JSON.stringify(_this.data.css)) + ";\n" + ((function() {
            if (this.data.cssIds) {
              if (this.data.cssIds.length !== this.data.css.length) {
                throw new Error("You must provide the same number of IDs as css");
              }
              return "var styleIds = " + (JSON.stringify(this.data.cssIds)) + ";";
            } else {
              return "";
            }
          }).call(_this)) + "\nfor(var i = 0; i < styleUrls.length; i++) {\n  var url = styleUrls[i];\n  var link = document.createElement('link');\n  link.href = " + host + "url" + timestamp + ";\n  " + (_this.data.cssIds ? "link.id = styleIds[i];" : "") + "\n  link.type = 'text/css';\n  link.rel = 'stylesheet';\n  link.onload = scriptLoaded;\n  document.head.appendChild(link);\n}";
        }
        content += "function scriptLoaded() {\n  loadedDependencies++;\n  if(numDependencies === loadedDependencies) {\n    afterDepsLoaded();\n  }\n}\nfunction afterDepsLoaded() {\n" + body + "\n}";
        if (_this.data.js && _this.data.css) {
          if (_this.data.js.length + _this.data.css.length === 0) {
            content += "afterDepsLoaded();\n";
          }
        } else {
          content += "afterDepsLoaded();\n";
        }
        return content;
      };
      checkBookmarkletLength = function(bookmarklet) {
        if (bookmarklet.length > bookmarkletWarnLength) {
          return grunt.log.writeln("WARNING: Your bookmarklet is longer than " + bookmarkletWarnLength + " characters.  It may not work in some browsers.");
        }
      };
      amdifyBookmarklet = function(bookmarklet) {
        var comment, hostParam;
        comment = "// Generated by grunt-bookmarklet-thingy. Refer to your grunt configuration file for configuration options.";
        if (_this.data.amdify) {
          hostParam = (_this.data.host ? 'host' : '');
          bookmarklet = bookmarklet.replace(new RegExp(hostMacro, 'g'), "' + host + '");
          bookmarklet = "define([], function () {\n  " + (_this.data.jshint ? "'use strict';" : "") + "\n  return {\n    getBookmarklet: function (" + hostParam + ") {\n      return '" + bookmarklet + "';\n    }\n  };\n});";
          bookmarklet = "" + comment + "\n" + bookmarklet;
          if (_this.data.jshint) {
            bookmarklet = "/*jshint scripturl:true*/\n" + bookmarklet;
          }
        }
        return bookmarklet;
      };
      outputBookmarklet = function(bookmarklet) {
        if (_this.data.out) {
          return fs.writeFileSync("./" + _this.data.out, bookmarklet);
        } else {
          return grunt.log.writeln(bookmarklet);
        }
      };
      body = getBody();
      content = getContent(body);
      bookmarklet = bookmarkletify(content);
      checkBookmarkletLength(bookmarklet);
      bookmarklet = amdifyBookmarklet(bookmarklet);
      return outputBookmarklet(bookmarklet);
    });
  };

}).call(this);
