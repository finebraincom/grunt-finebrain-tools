'use strict';

module.exports = function(grunt) {

	/*
	*	Installs phonegap plugins by list
	*
	*	Configuration options:
	*	{
	*		appDir : 'path/2/phonegap/app/dir',
	*		cacheDir : 'path/2/phonegap/plugins/cache/dir',
    *		phonegap : 'path/2/bin/phonegap',
	*		plugins : [
	*			{
	*				id : "id of the plugin",
	*				gitUrl : "url for cloning git repository",
	*				tag : "optional tag for fetching specific version"
	*			},
	*			{
	*				id : "id of the plugin",
	*				dirPath : "path to the folder with plugin",
	*				tag : "optional tag for fetching specific version"
	*			},
	*			. . .
	*		]
	*	}
	*/
    grunt.registerMultiTask(
    	"phonegap-plugins-install",
    	"install required phonegap plugins with local caching of plugins",
    	function(){
    		var done = this.async(),
    			_ = require('underscore'),
        		config = grunt.config.get("phonegap-plugins-install"),
            	cfg = config[this.target],
				fs = require('fs'),
				path = require('path'),
				exec = require('child_process').exec,
				async = require('async');

			//console.log(cfg);
			if(!grunt.file.exists(cfg.cacheDir)){
				grunt.file.mkdir(cfg.cacheDir);
			}

			async.eachSeries(cfg.plugins,
				function iterator(plugin, cb){
					var cachedPath = path.join(cfg.cacheDir, plugin.id);

					var installFromCache = function(cb){
						var cmd = cfg.phonegap + " plugin add " + cachedPath;
						exec(cmd, {cwd : cfg.appDir },function(err, stdout, stderr){
							if(err){
								return cb(err);
							}
							grunt.log.writeln('installed from cache: ' + plugin.id);
							cb();
						});
					};

					if(!grunt.file.exists(cachedPath)){
						var cmd;
						if(_.isUndefined(plugin.gitUrl)){
							// local folder
							cmd = [
								'cp -r',
								plugin.dirPath,
								cachedPath
							].join(' ');
						}else{
							cmd = [
								'git clone --depth=1',
								plugin.tag ? '-b ' + plugin.tag : '',
								plugin.gitUrl,
								cachedPath
							].join(' ');
						}
						//console.log('FETCH PLUGIN: ' + cmd);
						exec(cmd, {}, function(err, stdout, stderr){
							if(err){
								return cb(err);
							}
							grunt.log.writeln('plugin cached: ' + plugin.id);
							installFromCache(cb);
						});
					}else{
						installFromCache(cb);
					}
				},
				function finished(err){
					if(err){
						console.log(err);
						grunt.fail.warn(err);
					}
					grunt.log.ok('plugins installed');
					done();
				}
			);
		}
	);
};
