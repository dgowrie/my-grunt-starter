my-grunt-starter
================

# My Grunt Starter
A template for grunt-based projects.


1. Add node_modules directory to version control ignore list

2. Use the --save-dev flag when installing grunt and all gruntplugins
Ex: npm install grunt --save-dev

3. Add private: true to package.json

4. Test your work by checking out a new working copy and attempting to run Grunt tasks.

Include in your README install instructions for all other dependencies
Example README follows....




----
## LOCAL SETUP

**Grunt**
The project is using Grunt as a task runner, including:
  * real-time compiling, concatenating, minifying, and linting
  * watching and reloading
  * build / deploy tasks
  * general development environment and workflow standardization
  * ...more

Grunt has already been configured with a package.json and a Gruntfile. ([Grunt.js](http://gruntjs.com/getting-started))

**Sass**
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
+ Developers can work independently
+ Avoid stepping on each other's git toes
+ Yet still share changes with others when necessary

**Basic workflow:**
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
We are following a basic modular approach, and the directory structure and file naming conventions reflect this. Modules are @import'ed from within the main styles.scss file.

Example: You are building the "nav" component:
  * The dependent CSS (in .scss Sass format) should be developed as self-contained module under the '/sass/modules/' directory
  * The file should be saved as a partial, e.g. '_nav.scss'
  * Add an @import for that modules inside styles.scss file

### Compiled CSS, Avoiding Git Conflicts
In order to avoid unneccessary merge conflicts in compiled CSS, 'style.min.css' and related compiled CSS files have been added to the .gitignore.

Just to be clear:
**CSS is generated from the Sass**
**Work only in the Sass files**
**Never edit compiled CSS (e.g. style.min.css) directly** - it is not under version control and will be overwritten