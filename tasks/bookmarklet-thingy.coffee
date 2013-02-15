#
# * grunt-bookmarklet-thingy
# * https://github.com/justspamjustin/grunt-bookmarklet-thingy
# *
# * Copyright (c) 2013 Justin Martin
# * Licensed under the MIT license.
#

bookmarkletify = require("bookmarkletify")
fs = require("fs")
bookmarkletWarnLength = 2000

module.exports = (grunt) ->

  # ==========================================================================
  # TASKS
  # ==========================================================================

  grunt.registerMultiTask "bookmarklet", "Builds a bookmarklet based on your provided source files.", ->
    timestamp = (if @data.timestamp then " + '?t=' + Date.now()" else '')
    # Use a macro for __HOST__
    hostMacro = '__HOST__'
    host = (if @data.host && @data.amdify then "'http://' + '" + hostMacro + "' + " else '')

    getBody = =>
      body = ''
      if @data.body
        body+= fs.readFileSync("./#{@data.body}")
      return body

    getContent = (body) =>
      content = ''
      content += """
        var numDependencies = 0,
            loadedDependencies = 0;
      """

      if @data.js
        content += """numDependencies += #{@data.js.length};\n"""

      if @data.css
        content += """numDependencies += #{@data.css.length};\n"""

      if @data.js
        content += """
          var scriptUrls = #{JSON.stringify(@data.js)};
          for(var i = 0; i < scriptUrls.length; i++) {
            var url = scriptUrls[i];
            var script = document.createElement('script');
            script.src = #{host}url#{timestamp};
            script.type = 'text/javascript';
            script.onload = scriptLoaded;
            document.body.appendChild(script);
          }
        """

      if(@data.css)
        content += """
          var styleUrls = #{JSON.stringify(@data.css)};
          for(var i = 0; i < styleUrls.length; i++) {
            var url = styleUrls[i];
            var link = document.createElement('link');
            link.href = #{host}url#{timestamp};
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.onload = scriptLoaded;
            document.head.appendChild(link);
          }
        """

      content += """
        function scriptLoaded() {
          loadedDependencies++;
          if(numDependencies === loadedDependencies) {
            afterDepsLoaded();
          }
        }
        function afterDepsLoaded() {
        #{body}
        }
      """
      if @data.js && @data.css
        if @data.js.length + @data.css.length == 0
          content += "afterDepsLoaded();\n"
      else
        content += "afterDepsLoaded();\n"
      return content

    checkBookmarkletLength = (bookmarklet) =>
      if bookmarklet.length > bookmarkletWarnLength
        grunt.log.writeln("WARNING: Your bookmarklet is longer than #{bookmarkletWarnLength} characters.  It may not work in some browsers.")

    amdifyBookmarklet = (bookmarklet) =>
      if @data.amdify
        hostParam = (if @data.host then 'host' else '')
        bookmarklet = bookmarklet.replace(new RegExp(hostMacro,'g'),"' + host + '")
        bookmarklet = """
          define([], function () {
            #{if @data.jshint then "'use strict';" else ""}
            return {
              getBookmarklet: function (#{hostParam}) {
                return '#{bookmarklet}';
              }
            };
          });
        """
        if @data.jshint
          bookmarklet = "/*jshint scripturl:true*/\n#{bookmarklet}"
      return bookmarklet

    outputBookmarklet = (bookmarklet) =>
      if @data.out
        fs.writeFileSync("./#{@data.out}",bookmarklet)
      else
        grunt.log.writeln(bookmarklet)

    body = getBody()
    content = getContent(body)
    bookmarklet = bookmarkletify(content)
    checkBookmarkletLength(bookmarklet)
    bookmarklet = amdifyBookmarklet(bookmarklet)
    outputBookmarklet(bookmarklet)
