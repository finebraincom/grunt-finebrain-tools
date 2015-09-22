'use strict';

module.exports = function(grunt) {
    grunt.registerMultiTask(
        "version", 
        "generates version module", 
        function(){
            var _ = require("underscore"),
                config = grunt.config.get("version"),
                cfg = config[this.target],
                version, content;

            if(_.isUndefined(cfg.version)){
                version = grunt.config.get('pkg.version');
            }else{
                version = cfg.version;
            }

            switch(cfg.format){
                case 'text':
                    content = version;
                    break;
                default: // requirejs module
                    content = ["define(function () { return '", version, "'; });"].join('');
            }
            grunt.file.write(cfg.dest, content);

        }
    );
};