'use strict';

module.exports = function(grunt) {

    var CONSOLE_RE = /console\./;
    // strips lines with console calls
    grunt.registerMultiTask("strip-console", "strips console statement lines from source code", function(){
        var _ = require('underscore'),
            config = grunt.config.get("strip-console"),
            cfg = config[this.target];

        function processFiles(srcDir, destDir){
            var counter = 0,
                fileOptions = {
                    encoding : 'utf8'
                };
            grunt.file.recurse(srcDir, function(abspath, rootdir, subdir, filename){
                //console.log('src: ' + abspath);
                var dest = [cfg.dest];
                if(subdir){
                    dest.push(subdir);
                }
                dest.push(filename);
                dest = dest.join('/');

                var fileContent = grunt.util.normalizelf(grunt.file.read(abspath, fileOptions));
                var lines = fileContent.split(grunt.util.linefeed);
                var resLines = [];
                _.each(lines, function(line){
                    if(CONSOLE_RE.test(line)){
                        return; // strip
                    }
                    resLines.push(line);
                });
                grunt.file.write(dest, resLines.join(grunt.util.linefeed), fileOptions);
                grunt.log.writeln(['Processed', abspath, '->', dest].join(' '));
                counter += 1;
            });
            return counter;
        }
        var count = processFiles(cfg.srcDir, cfg.dest);
        grunt.log.ok('' + count + ' js files processed in ' + cfg.dest);
    });
};