my-grunt-starter
================

# My Grunt Starter
A template for Grunt-based projects.

At its most essential, Grunt Starter creates a directory tree, fires up a local server, and watches for changes to compile code and reload in a browser.

Grunt Starter creates the following default directory structure:

````
	build/				[compiled code, built by Grunt]
		assets/
			css/
			images/
			js/
				vendor/
		index.html
	dist/				[compiled and minified code, built by Grunt]
	src/				[all dev work done here]
		html/			[app static html]
			index.html
		javascript/		[app custom JS]
			apps.js
		sass/			[app custom styles]
			style.scss
		vendor/			[vendor libs, e.g. Modernizr etc]
````

The `src` directory is where app development work will be done.

The local server root points to the `build` dir.

The default Grunt task automatically copies `src` assets to `build` (compiled).

The `grunt deploy` task copies `build` assets to `dist` (minified).

Example README follows....


----
## LOCAL SETUP

### Grunt
The project is using Grunt as a task runner, including:
  * real-time compiling, concatenating, minifying, and linting
  * watching and reloading
  * build / deploy tasks
  * general development environment and workflow standardization
  * ...more

Grunt has already been configured with a package.json and a Gruntfile. ([Grunt.js](http://gruntjs.com/getting-started))

### Sass
Sass is used to preprocess and compile CSS, all handled by Grunt on your local setup. Sass Source maps are enabled, to make debugging easier.


### Install or Update all Project Dependencies:

1. Node.js 
  * [Node.js](http://nodejs.org/)
2. Grunt (Node.js dependecy)
  * [Grunt](http://gruntjs.com/)
3. Grunt CLI (Grunt's command line interface (CLI) - installed globally)
  `$ npm install -g grunt-cli` (You may need to use sudo here)
4. Sass
  `$ sudo gem install sass --pre` (cutting edge required to work with Source Maps)
5. Clone the repo from git:
  `$ git clone git@example.come/path-to-repo.git`



### Start working with the existing Grunt project.
1. Change to the project's root directory.
2. Install project dependencies:
`$ npm install` (You may need to use sudo here)
3. Run Grunt:
`$ grunt`

----
## PROJECT NOTES


### Git Workflow
We are using a 'feature branch workflow' which is a simplified version of the ["git flow" workflow](https://www.google.com/search?q=git+flow).
Basically, each new feature should reside in its own branch. By isolating features into separate branches:
  * Developers can work independently
  * Avoid stepping on each other's git toes
  * Yet still share changes with others when necessary


#### Basic workflow:
1. Branch off of master, creating a feature branch - e.g 'feature/header' or 'feature/socialshare'
2. Do all the work related to that feature in the feature branch before merging back into master.
3. Feature branches can be pushed to the central repository for backup/collaboration, if needed.
4. Once a feature is complete, merge the feature branch into master
5. Delete the feature branch

````
$ git checkout master 
$ git pull origin master 
$ git checkout -b feature/my-feature 
// work work work, commit, repeat... 
$ git checkout master
$ git pull origin master
$ git merge feature/my-feature 
$ git branch -d feature/my-feature
````


### File Structure for Sass (CSS)
We are following a basic modular approach, and the directory structure and file naming conventions reflect this.

Example Sass directory structure:

````
	src/
		sass/
			style.scss
			modules/
				_foo.scss
````

Add Sass partials as needed. Parials should be @import'ed from within the main styles.scss file.

Example: You are building the "nav" component:
  * The dependent CSS (in .scss Sass format) should be developed as self-contained module under the '/sass/modules/' directory
  * The file should be saved as a partial, e.g. '_nav.scss'
  * Add an @import for that modules inside styles.scss file


### Compiled Source: Do NOT Edit - Git-Ignored
In order to avoid unneccessary merge conflicts in compiled source code, the 'build' and 'dist' dirs have been added to the .gitignore. You should not be editing any compiled code in the 'build' or 'dist' dirs.

Just to be clear:

**Work only in the `src` dir codebase**

**The `build` and `dist` code is generated and compiled via Grunt**

**Never edit compiled code (e.g. `build\assets\css\style.css`) directly** - it is not under version control and will be overwritten
