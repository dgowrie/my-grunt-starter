/*!
 *
 * Grunt Task configuration for MY BIG project
 *
 * Assumptions:
 * - Using Sass
 * - Enabled CSS source maps in Chrome
 */

'use strict';

/**
 * Livereload and connect variables
 */
var LIVERELOAD_PORT = 35729,
	lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT}),
	mountFolder = function(connect, dir) {
		return connect.static(require('path').resolve(dir));
	};

/**
 * Grunt module
 */
module.exports = function(grunt) {

	/**
	 * Dynamically load npm tasks
	 */
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
	
	/**
	 * Grunt config
	 */
	grunt.initConfig({
	
		//
		// Meta
		//

		pkg: grunt.file.readJSON('package.json'),

		/**
		 * Set project info
		 */
		project: {
			src: 'src/',
			assets: '<%= project.src %>',
			cssDir: '<%= project.assets %>css/',
			scss: '<%= project.cssDir %>sass/style.scss',
			jsDir: ['<%= project.assets %>js/'],
			build: 'build'
		},

		/**
		 * Project banner
		 * Dynamically appended to styles/JS files
		 * Inherits text from package.json
		 */
		banner: '/*!\n' +
		' * <%= pkg.name %>\n' + 
		' * <%= pkg.title %>\n' +
		' * <%= pkg.url %>\n' + 
		' * @author <%= pkg.author %>\n' + 
		' * @version <%= pkg.version %>\n' + 
		' * Copyright (c) <%= grunt.template.today("yyyy") %>\n' +
		' */\n',


		//
		// Server Related Tasks
		//

		/**
		 * Connect port/livereload
		 * https://github.com/gruntjs/grunt-contrib-connect
		 * Starts a local webserver and injects
		 * livereload snippet
		 */
		connect: {
			options: {
				port: 9000,
				hostname: '*'
			},
			livereload: {
				options: {
					middleware: function(connect) {
						return [
							lrSnippet,
							mountFolder(connect, 'src')
						];
					}
				}
			}
		},

		/**
		 * Opens the web server in the browser
		 * https://github.com/jsoverson/grunt-open
		 */
		open: {
			server: {
				path: 'http://localhost:<%= connect.options.port %>',
				app: 'Google Chrome'
			}
		},


		//
		// JS Tasks
		//

		/**
		 * JSHint
		 * https://github.com/gruntjs/grunt-contrib-jshint
		 * Manage the options inside .jshintrc file
		 */
		jshint: {
			files: ['<%= project.jsDir %>script.js', 'Gruntfile.js'],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		/**
		 * Concatenate JavaScript files
		 * https://github.com/gruntjs/grunt-contrib-concat
		 * Imports all .js files and appends project banner
		 */
		concat: {
			dev: {
				files: {
					'<%= project.jsDir %>scripts.min.js': [
						'<%= project.jsDir %>script.js'
						// more files added to array as needed
					]
				}
			},
			options: {
				stripBanners: true,
				nonull: true,
				banner: '<%= banner %>'
			}
		},

		/**
		 * Uglify (minify) JavaScript files
		 * https://github.com/gruntjs/grunt-contrib-uglify
		 * Compresses and minifies all JavaScript files into one
		 */
		uglify: {
			options: {
				preserveComments: false,
				banner: '<%= banner %>'
			},
			build: {
				files: {
				'<%= project.build %>/js/scripts.min.js': '<%= project.jsDir %>scripts.min.js'
				}
			}
		},


		//
		// CSS Tasks
		//

		/**
		 * Compile Sass/SCSS files
		 * https://github.com/gruntjs/grunt-contrib-sass
		 * Compiles all Sass/SCSS files and appends project banner
		 */
		sass: {
			dev: {
				options: {
					style: 'expanded',
					banner: '<%= banner %>',
					lineNumbers: true,
					sourcemap: true
				},
				files: {
					'<%= project.cssDir %>style.unprefixed.css': '<%= project.scss %>'
				}
			}
		},

		/**
		 * Autoprefixer
		 * Adds vendor prefixes automatically
		 * https://github.com/nDmitry/grunt-autoprefixer
		 */
		autoprefixer: {
			options: {
				browsers: ['last 2 version', 'safari 6', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
				map: true
			},
			dev: {
				files: {
					'<%= project.cssDir %>style.min.css': ['<%= project.cssDir %>style.unprefixed.css']
				}
			}
		},

		/**
		 * CSSMin
		 * CSS minification
		 * https://github.com/gruntjs/grunt-contrib-cssmin
		 */
		cssmin: {
			build: {
				options: {
					banner: '<%= banner %>'
				},
				files: {
					'<%= project.build %>style.min.css': ['<%= project.cssDir %>style.min.css']
				}
			}
		},


		//
		// Housekeeping
		//

		/**
		 * Copies files to the build dir
		 * https://github.com/gruntjs/grunt-contrib-copy
		 */
		copy: {
			build: {
				files: [
					{
						expand: true,
						cwd: '<%= project.assets %>',
						src: ['*', 'images/*'],
						dest: '<%= project.build %>/'
					}
				]
			}
		},

		/**
		 * Clean files and folders
		 * https://github.com/gruntjs/grunt-contrib-clean
		 * Remove generated files for clean deploy
		 */
		clean: {
			build: ['<%= project.cssDir %>style.unprefixed.css', '<%= project.cssDir %>style.prefixed.css']
		},

		/**
		 * Runs tasks against changed watched files
		 * https://github.com/gruntjs/grunt-contrib-watch
		 * Watching development files and run concat/compile tasks
		 * Livereload the browser once complete
		 */
		watch: {
			concat: {
				files: ['<%= project.src %>/js/{,*/}*.js'],
				tasks: ['concat:dev']
				options: {
					spawn: false,
					livereload: true
				}
			},
			sass: {
				files: ['<%= project.src %>/styles/sass/{,*/}*.{scss,sass}'],
				tasks: ['sass:dev', 'autoprefixer:dev']
				options: {
					spawn: false,
					livereload: true
				}
			},
			livereload: {
				files: [
					'<%= project.src %>{,*/}*.html',
					'<%= project.assets %>{,*/}*.{min.css, min.js}',
					'<%= project.assets %>{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
				],
				options: {
					livereload: LIVERELOAD_PORT
				}				
			}
		}
	});
	
	
	//
	// Tasks Registry
	//

	/**
	 * Default task
	 * Run `grunt` on the command line
	 */
	grunt.registerTask('default', ['sass:dev', 'autoprefixer:dev', 'concat:dev', 'connect:livereload', 'open', 'watch']);

	/**
	 * Build task
	 * Run `grunt build` on the command line
	 * Then compress all JS/CSS files
	 */
	grunt.registerTask('build', ['sass:dev', 'autoprefixer:dev', 'cssmin:build', 'concat:dev', 'jshint', 'uglify', 'copy:build']);
};
