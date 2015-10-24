/**
 *  generator-django-agility
 *  (c) Nikita Sobolev: https://github.com/sobolevn
 *
 *  This software is released under the MIT License:
 *  http://www.opensource.org/licenses/mit-license.php
 */

'use strict';

/* Options list:
 * --skip-install : do not install dependencies
 *
 */

// Dependencies:
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var path = require('path');

function makeString(rawString){
  return rawString.toLowerCase().split(' ').join('_').split('-').join('_');
}

module.exports = yeoman.generators.Base.extend({

  constructor: function(){
    yeoman.generators.Base.apply(this, arguments);

    this.option('skip-install');
  },

  initializing: function(){
    // this.pkg = require('../package.json');
    this.appname = makeString(this.appname);

    this.agility = {};
    this.agility._defaults = {
      // default null-type for everything:
      none: 'none',

      // css preprocessors:
      scss: 'scss',
      sass: 'sass',

      // django:
      djangoVersion: '1.7'
    };

    // Generating Django's secret key:
    // https://docs.djangoproject.com/en/1.8/ref/settings/#secret-key
    function generateSecretKey(length){
      var array = [];
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijk' +
        'lmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';

      for(var i = 0; i < length; i++ ){
        array.push(possible.charAt(Math.floor(Math.random() * possible.length)));
      }

      return array.join('');
    }

    this.agility.secretKey = generateSecretKey(50);
  },

  /**
   * Author information
   */
  prompting0:function(){
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('DjangoAgility') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'author',
      message: 'What\'s your name? It will be used all across this project. (required) ',
      store: true,
      validate: function(input) { return input !== '' ? true : 'Your name is very important'; }
    }, {
      type: 'input',
      name: 'email',
      message: 'What\'s your email? It will be used all across this project.',
      //default: '',
      store: true
    }, {
      type: 'input',
      name: 'github',
      message: 'What\'s your github account? It will be used all across this project.',
      //default: '',
      store: true
    }];

    this.prompt(prompts, function(answers){
      this.agility.author = answers.author;
      this.agility.email = answers.email;
      this.agility.github = answers.github;

      done();
    }.bind(this));
  },

  /**
  * Project name, type and version
  */
  prompting1: function(){
    var done = this.async();

    this.log(
      'What ' + chalk.red('project') + ' are you starting?'
    );

    var prompts = [{
      type: 'input',
      name: 'projectName',
      message: 'This project needs a name! (required) ',
      default: makeString(this.appname),
      validate: function(input) {
        return input !== '' ? true : 'Your project must have a name!';
      }
    }, {
      type: 'confirm',
      name: 'projectPublic',
      message: 'Is it a public project? (No - by default)',
      default: false
    }];

    this.prompt(prompts, function(answers){
      this.agility.projectName = makeString(answers.projectName);
      this.agility.projectPublic = answers.projectPublic;

      this.config.set('projectName', this.agility.projectName);

      done();
    }.bind(this));
  },

  /**
   * Python and Django apps to be included or excluded from the build.
   */
  prompting2: function(){

  },

  /**
   * All technology-based stuff.
   */
  prompting3: function(){
    var done = this.async();

    this.log(
      'What ' + chalk.red('technologies') + ' do you want to use?'
    );

    var prompts = [{
      type: 'confirm',
      name: 'preprocessor',
      message: 'Do you want to use a CSS preprocessor?'
    }, {
      when: function(answer){ return answer.preprocessor; },
      type: 'list',
      name: 'preprocessorType',
      message: 'Which one?',
      choices: [{
        name: 'scss',
        value: 'scss',
        checked: true
      }, {
        name: 'sass',
        value: 'sass',
        checked: false
      }]
    }];

    this.prompt(prompts, function (answers) {
      this.agility.preprocessor = answers.preprocessor;
      this.agility.preprocessorType = answers.preprocessor ?
        answers.preprocessorType : this.agility._defaults.none;

      this.config.set('preprocessorType', this.agility.preprocessorType);

      done();
    }.bind(this));

  },

  configuring: {
    styleGuides: function(){
      this.fs.copy(this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig'));
      this.fs.copy(this.templatePath('_setup.cfg'),
        this.destinationPath('setup.cfg'));
      this.fs.copy(this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc'));
    },

    versionControl: function(){
      this.fs.copy(this.templatePath('gitignore'),
        this.destinationPath('.gitignore'));
      this.fs.copy(this.templatePath('gitattributes'),
        this.destinationPath('.gitattributes'));
    }
  },

  writing: {

    // Python, Django and Django-templates:

    python: function(){
      function destinationFilename(projectName, filename){
        return path.join(projectName, filename.replace('.tml', ''));
      }

      var djangoDirectory = 'django_server';
      var djangoFiles = [
        '__init__.py.tml',
        'urls.py.tml',
        'wsgi.py.tml',
        'settings/__init__.py.tml',
        'settings/components/__init__.py.tml',
        'settings/components/common.py.tml',
        'settings/environments/__init__.py.tml',
        'settings/environments/development.py.tml',
        'settings/environments/production.py.tml',
        'settings/environments/testing.py.tml',
      ];

      for (var i = 0; i < djangoFiles.length; i++){
        this.template(
          this.templatePath(path.join(djangoDirectory, djangoFiles[i])),
          this.destinationPath(destinationFilename(
            this.agility.projectName, djangoFiles[i]))
        );
      }

      this.template(this.templatePath('manage.py.tml'),
        this.destinationPath('manage.py'));
    },

    templates: function(){
      var mainFolder = 'django_templates';
      var templateFiles = [
        '_layouts/base.html',
        'status_pages/400.html',
        'status_pages/403.html',
        'status_pages/404.html',
        'status_pages/500.html',
        'txt/crossdomain.xml',
        'txt/robots.txt',
        'txt/humans.txt',
        'txt/sitemap.xml'
      ];

      for (var i = 0; i < templateFiles.length; i++){
        this.template(
          this.templatePath(path.join(mainFolder,templateFiles[i])),
          this.destinationPath(path.join('templates', templateFiles[i]))
        );
      }

    },

    // Non-Python files:

    pipRequirements: function(){
      var mainFolder = 'requirements';
      var files = [
        '_base.txt',
        '_env.txt',
        'development.txt',
        'production.txt',
        'testing.txt'
      ];

      for (var i = 0; i < files.length; i++) {
        this.fs.copy(
          this.templatePath(path.join(mainFolder, files[i])),
          this.destinationPath(path.join(mainFolder, files[i]))
        );
      }
    },

    developmentConfiguration: function(){
      var mainFolder = 'config';
      var files = ['config.secret'];
      for (var i = 0; i < files.length; i++) {
        this.template(
          this.templatePath(path.join(mainFolder, files[i])),
          this.destinationPath(path.join(mainFolder, files[i]))
        );
      }

    },

    packageManagers: function(){
      this.template(this.templatePath('_package.json'),
        this.destinationPath('package.json'));
      this.template(this.templatePath('_bower.json'),
        this.destinationPath('bower.json'));
    },

    prepocessors: function(){
      if (!this.agility.preprocessor ||
          this.agility.preprocessorType === 'none'){
        return;
      }

      var type = this.agility.preprocessorType;

      function destinationFilename(filename){
        return path.join(type, filename + '.' + type);
      }

      var preprocessorFiles = [
        'main',
        'modules/all',
        'functions/functions',
        'functions/mixins',
        'partials/brand',
        'partials/fixes'
      ];

      for (var i = 0; i < preprocessorFiles.length; i++){
        this.fs.copy(
          this.templatePath(path.join('preprocessor',
            preprocessorFiles[i])),
          this.destinationPath(destinationFilename(preprocessorFiles[i]))
        );
      }
    },

    readmes: function(){
      this.template(this.templatePath('_README.md'),
        this.destinationPath('README.md'));
      this.template(this.templatePath('_CONTRIBUTING.md'),
        this.destinationPath('CONTRIBUTING.md'));
    },

    manifest: function(){
      this.fs.copy(this.templatePath('_MANIFEST.in'),
        this.destinationPath('MANIFEST.in'));
    },

    statics: function(){
      var mainFolder = 'static';
      var subFolders = ['css', 'js', 'img', 'build', 'var'];

      for (var i = 0; i < subFolders.length; i++){
        mkdirp(this.destinationPath(path.join(mainFolder, subFolders[i])));
      }

      var mediaFolder = 'media';
      mkdirp(this.destinationPath(mediaFolder));
    },

    license: function(){
      this.template(this.templatePath('_LICENSE.md'),
        this.destinationPath('LICENSE.md'));
    }

  },

  install: function(){
    if (!this.options['skip-install']) {
      // NPM and Bower dependencies:
      this.log('Installing NPM and Bower dependencies');
      this.installDependencies({ skipInstall: this.options['skip-install'] });

      // Install pip dependencies if virtualenv is enabled:
      this.log('Checking for virtualenv.');
      if (process.env.VIRTUAL_ENV) {
        this.log('Virtualenv found:', process.env.VIRTUAL_ENV);
        this.log('Running', chalk.red('pip install -r ' +
          this.destinationPath('requirements/development.txt')));
        this.spawnCommand('pip', ['install', '-r',
          this.destinationPath('requirements/development.txt')]);

      } else {
        // It is not a good idea to install python packages into
        // system's python.
        this.log('Your python dependencies are not installed,',
          'because not virtualenv was found. To install it later type:\n',
          'pip install requirements/development.txt');
      }

    } else {
      this.log('You wished to skip installation.');
      this.log('Run "', chalk.red('npm install & bower install'),
       '" to install Javascript dependencies.');
      this.log('Run "', chalk.red('pip install -r ' +
        this.destinationPath('requirements/development.txt')),
        '" to install Python dependencies.');

    }

  }
});
