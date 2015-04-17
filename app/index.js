/**
 *  generator-django-agility
 *  (c) Nikita Sobolev: https://github.com/sobolevn
 *
 *  This software is released under the MIT License:
 *  http://www.opensource.org/licenses/mit-license.php
 */

'use strict';

/* Options list:
 * --silent : no output
 * --skip-install : do not install dependencies
 *
 */

// Dependencies:
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
    this.appname = this.appname.replace(' ', '_');
  },

  /**
  * Project name, username and etc.
  */
  prompting1: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('DjangoAgility') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'agilityProjectName',
      message: 'This project needs a name!',
      default: this.appname,    // Default to current folder name
      store: true
    }, {
      type: 'input',
      name: 'agilityAuthor',
      message: 'And what\'s your name? It will be used all across this project.',
      required: true,
      store: true,
      validate: function(input) { return input !== '' ? true : 'Your name is very important'; }
    }, {
      type: 'input',
      name: 'agilityEmail',
      message: 'What\'s your email? It will be used all across this project.',
      default: '',
      store: true
    }, {
      type: 'input',
      name: 'agilityGithub',
      message: 'What\'s your github account? It will be used all across this project.',
      default: '',
      store: true
    }];

    this.prompt(prompts, function (answers) {
      this.agilityProjectName = answers.agilityProjectName;
      this.agilityAuthor = answers.agilityAuthor;
      this.agilityEmail = answers.agilityEmail;
      this.agilityGithub = answers.agilityGithub;

      done();
    }.bind(this));
  },

  /**
  * All technology-based stuff.
  */
  prompting2: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(
      'What ' + chalk.red('technologies') + ' do you want to use?'
    );

    var prompts = [{
      type: 'confirm',
      name: 'agilityPreprocessor',
      message: 'Do you want to use a CSS preprocessor?',
      store: true
    }, {
      when: function(answer){ return answer.agilityPreprocessor; },
      type: 'list',
      name: 'agilityPreprocessorType',
      message: 'Which one?',
      choices: [{
        name: 'Scss',
        value: 'scss',
        checked: false
      }],
      store: true
    }];

    this.prompt(prompts, function (answers) {
      this.agilityPreprocessor = answers.agilityPreprocessor;

      this.config.set('agilityPreprocessor', this.agilityPreprocessor);

      done();
    }.bind(this));

  },

  writing: {
    app: function () {
      this.template(
        this.templatePath('_package.json'),
        this.destinationPath('package.json')
      );
      this.template(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json')
      );
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
    }
  },

  install: function () {
    // this.installDependencies();
  }
});
