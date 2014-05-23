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
 * Default port: 35729
 * Custom ports allowed for multiple instances of Livereload on different ports
 * 'livereload' key:value option (incl those in watch task) should all reference the 'LIVERELOAD_PORT' var as the value
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
			src: 			'src/',
			build: 			'build/', 
			dist: 			'dist/',

			srcHtmlDir: 	'<%= project.src %>html/',
			srcSassDir: 	'<%= project.src %>sass/',
			srcScss: 		'<%= project.srcSassDir %>style.scss',
			srcJsDir: 		'<%= project.src %>javascript/',

			buildAssets: 	'<%= project.build %>assets/', 
			buildCssDir: 	'<%= project.buildAssets %>css/',
			buildJsDir: 	'<%= project.buildAssets %>js/',

			distAssets: 	'<%= project.dist %>assets/',
			distCssDir: 	'<%= project.distAssets %>css/',
			distJsDir: 		'<%= project.distAssets %>js/'
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
		 * in conjunction with livereload snippet
		 * Default server port: 9000
		 * Custom port for multiple instances of connect server (configure custom livereload port as well)
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
							mountFolder(connect, 'build')
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
			files: ['<%= project.srcJsDir %>{,*/}*.js', 'Gruntfile.js'],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		/**
		 * Concatenate JavaScript files
		 * https://github.com/gruntjs/grunt-contrib-concat
		 * Imports and combines all JavaScript files into one and appends project banner
		 */
		concat: {
			dev: {
				files: {
					'<%= project.buildJsDir %>scripts.min.js': [ // appended with .min, but not minified for dev build
						'<%= project.srcJsDir %>{,*/}*.js'
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
		 * Compresses / minifies JavaScript build file, copies to dist JS dir
		 */
		uglify: {
			options: {
				preserveComments: false,
				banner: '<%= banner %>'
			},
			deploy: {
				files: {
				'<%= project.distJsDir %>scripts.min.js': '<%= project.buildJsDir %>scripts.min.js'
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
					'<%= project.buildCssDir %>style.unprefixed.css': '<%= project.srcScss %>'
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
					'<%= project.buildCssDir %>style.css': ['<%= project.buildCssDir %>style.unprefixed.css']
				}
			}
		},

		/**
		 * CSSMin
		 * Minification of CSS build file, copies to dist CSS dir
		 * https://github.com/gruntjs/grunt-contrib-cssmin
		 */
		cssmin: {
			deploy: {
				options: {
					banner: '<%= banner %>'
				},
				files: {
					'<%= project.distCssDir %>style.css': ['<%= project.buildCssDir %>style.css']
				}
			}
		},


		//
		// Housekeeping
		//

		/**
		 * Copies files to the build & dist dirs
		 * https://github.com/gruntjs/grunt-contrib-copy
		 */
		copy: {
			// HTML from src dir to build dir
			toBuildHtml: {
				files: [
					{
						cwd: '<%= project.srcHtmlDir %>',
						expand: true,
						src: '**/*',
						dest: '<%= project.build %>'
					}
				]
			},

			// All HTML and image assets from build dir to dist dir
			toDist: {
				files: [
					// image assets
					{
						cwd: '<%= project.buildAssets %>images',
						expand: true,
						src: [
							'**/*'
							// more files added to array as needed
							],
						dest: '<%= project.distAssets %>images'
					},
					// html
					{
						cwd: '<%= project.build %>',
						expand: true,
						src: [
							'{,*/}*.html'
						],
						dest: '<%= project.dist %>'
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
			//build: ['<%= project.cssDir %>style.unprefixed.css', '<%= project.cssDir %>style.prefixed.css']
		},

		/**
		 * Runs tasks against changed watched files
		 * https://github.com/gruntjs/grunt-contrib-watch
		 * Watching development files and run concat/compile tasks
		 * Livereload the browser once complete
		 */
		watch: {
			js: {
				files: ['<%= project.srcJsDir %>{,*/}*.js'],
				tasks: ['jshint', 'concat:dev'],
				options: {
					spawn: false,
					livereload: LIVERELOAD_PORT
				}
			},
			sass: {
				files: ['<%= project.srcSassDir %>{,*/}*.{scss,sass}'],
				tasks: ['sass:dev', 'autoprefixer:dev'],
				options: {
					spawn: false,
					livereload: LIVERELOAD_PORT
				}
			},
			html: {
				files: ['<%= project.srcHtmlDir %>{,*/}*.html'],
				tasks: ['copy:toBuildHtml'],
				options: {
					spawn: false,
					livereload: LIVERELOAD_PORT
				}
			},
			livereload: {
				files: [
					'<%= project.build %>{,*/}*.html',
					'<%= project.buildAssets %>{,*/}*.{css, js}',
					'<%= project.buildAssets %>{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
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
	grunt.registerTask('default', ['copy:toBuildHtml', 'sass:dev', 'autoprefixer:dev', 'jshint', 'concat:dev', 'connect:livereload', 'open', 'watch']);

	/**
	 * Deploy task
	 * Run `grunt deploy` on the command line
	 * Then compress all JS/CSS files
	 */
	grunt.registerTask('deploy', ['sass:dev', 'autoprefixer:dev', 'cssmin', 'jshint', 'concat:dev', 'uglify', 'copy:toDist']);
};
