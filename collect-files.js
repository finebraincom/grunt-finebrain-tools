'use strict';

/*      Collects files into target forlder from common folders dir and target specific dir.
*
*       Configuration:
*
*       collect : {
*           <target> : {
*               srcDirs : {
*                   common : 'src/resources/images-src/default',
*                   specific : 'src/resources/images-src/cmf'
*               },
*               dest : 'src/resources/img'
*           }
*       }
*/
module.exports = function(grunt) {
    // collects images for specific target
    grunt.registerMultiTask("collect", "collects files for specific target", function(){
        var config = grunt.config.get("collect");
        var cfg = config[this.target];

        function copyFiles(srcDir, destDir){
            var counter = 0;
            grunt.file.recurse(srcDir, function(abspath, rootdir, subdir, filename){
                //console.log('src: ' + abspath);
                var dest = [cfg.dest];
                if(subdir){
                    dest.push(subdir);
                }
                dest.push(filename);
                dest = dest.join('/');
                grunt.file.copy(abspath, dest);
                grunt.log.writeln(['Copyied', abspath, '->', dest].join(' '));
                counter += 1;
            });
            return counter;
        }
        var count = copyFiles(cfg.srcDirs.common, cfg.dest);
        grunt.log.ok('' + count + ' common files collected in ' + cfg.dest);
        count = copyFiles(cfg.srcDirs.specific, cfg.dest);
        grunt.log.ok('' + count + ' specific files collected in ' + cfg.dest);

    });
};