'use strict';

module.exports = function(grunt) {

	/**
	*	expected config:
	*
	*	{
	*		'task-name' : {
                src : 'file to process',
                dest : 'outout file',
                patches : [
                    {
                        beforeStartLine : 'line content before the start of patching',
                        afterEndLine : 'line content after the patched chunck end',
                        contentFile : 'file with patched content'
                    },
                    ...
                ]
	*		}, 
	*		// ...
	*	}
	*
	*/
    grunt.registerMultiTask(
    	"patch-file", 
    	"patches-file with files content",
    	function(){
    		var _ = require('underscore');
        	var config = grunt.config.get("patch-file"),
            	cfg = config[this.target],
            	fileOptions = {
            		encoding : 'utf8'
            	};

         	var fileData = grunt.file.read(cfg.src, fileOptions);
         	var lines = fileData.split('\n');

         	_.each(cfg.patches, function(patch){
         		var lastFoundIdx, matchedValue;
         		var startIdx = 0;
         		if(patch.beforeStartLine){
		         	matchedValue = _.find(lines, function iterator(line, idx){
		         		lastFoundIdx = idx;
		         		return line.indexOf(patch.beforeStartLine) === 0; // match by start of str
		         	});
		         	if(matchedValue){
		         		startIdx = lastFoundIdx;
		         	}else{
		         		grunt.fail.warn('start line is not found in file: ' + cfg.src + ' for line : "' + patch.beforeStartLine + '"');
		         		return;
		         	}
		         	startIdx += 1;
		        }
	         	var endIdx = lines.length;
	         	if(patch.afterEndLine){
		         	matchedValue = _.find(lines, function iterator(line, idx){
		         		lastFoundIdx = idx;
		         		return line.indexOf(patch.afterEndLine) === 0; // match by start of str
		         	});
		         	if(matchedValue){
		         		endIdx = lastFoundIdx;
		         	}else{
		         		grunt.fail.warn('end line is not found in file: ' + cfg.src + ' for line : "' + patch.afterEndLine + '"');
		         		return;
		         	}
		         }
		         if(patch.beforeStartLine && patch.afterEndLine){
		         	if(startIdx > endIdx){
						grunt.fail.warn('end line goes before the start line');
						return;
		         	}
		         }
		         var patchContent = grunt.file.read(patch.contentFile, fileOptions);
		         var patchLines = patchContent.split('\n');
		         var patchedLines = [], i;
		         //console.log('' + startIdx + '-' + endIdx);
		         for(i = 0; i < startIdx; ++i){
		         	patchedLines.push(lines[i]);
		         }
		         _.each(patchLines, function(line){
		         	patchedLines.push(line);
		         });
		         for(i = endIdx; i < lines.length; ++i){
		         	patchedLines.push(lines[i]);
		         }
		         lines = patchedLines;
         	});
    		//console.log(lines.length);
    		grunt.file.write(cfg.dest, lines.join('\n'), fileOptions);
    		grunt.log.ok('patched file: ' + cfg.dest);

        }
    );
};