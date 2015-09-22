'use strict';

module.exports = function(grunt) {

	/**
	*	expected config:
	*
	*	{
	*		'task-name' : {
	*			template : 'template/file/path',
	*			dest : 'file/to/generate/path',
	*			config : {
	*				// template parameters 
	*			}
	*		}, 
	*		// ...
	*	}
	*
	*/
    grunt.registerMultiTask(
    	"generate", 
    	"generate file from underscore template file",
    	function(){
    		var _ = require('underscore');
        	var config = grunt.config.get("generate"),
            	cfg = config[this.target],
            	template = grunt.file.read(cfg.template);
        	grunt.file.write(cfg.dest, _.template(template)(cfg.config));
        	grunt.log.ok('generated file: ' + cfg.dest);
    	}
    );
};