/**
 *  generator-django-agility
 *  (c) Nikita Sobolev: https://github.com/sobolevn
 *
 *  This software is released under the MIT License:
 *  http://www.opensource.org/licenses/mit-license.php
 */

'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var mkdirp = require('mkdirp');
var path = require('path');

module.exports = yeoman.generators.Base.extend({
  constructor: function(){
    yeoman.generators.Base.apply(this, arguments);

    this.argument('djangoAppName', { type: String, required: true });
  },

  initializing: function(){
    this.log('Creating app: ' + this.djangoAppName);

    this.agilityStartApp = {
      appName: this.djangoAppName.toLowerCase().split('-').join('_')
    };
  },

  prompting: function(){
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(
      'You are going to configure a new ' + chalk.red('app')
    );

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
      default: '',
      store: true
    }, {
      type: 'input',
      name: 'github',
      message: 'What\'s your github account? It will be used all across this project.',
      default: '',
      store: true
    }];

    this.prompt(prompts, function(answers){
      this.agilityStartApp.author = answers.author;
      this.agilityStartApp.email = answers.email;
      this.agilityStartApp.github = answers.github;

      done();
    }.bind(this));
  },

  writing: {
    python: function(){
      function destinationFilename(directoryName, filename){
        return path.join(directoryName, filename.replace('.tml', ''));
      }

      var djangoFiles = [
        '__init__.py.tml', 'admin.py.tml', 'forms.py.tml', 'models.py.tml',
        'urls.py.tml', 'views.py.tml', 'migrations/__init__.py.tml', 'tests/__init__.py.tml'
      ];

      for (var i = 0; i < djangoFiles.length; i++){
        this.template(
          this.templatePath(djangoFiles[i]),
          this.destinationPath(destinationFilename(this.agilityStartApp.appName, djangoFiles[i]))
        );
      }
    },

    folders: function(){
      var app = this.agilityStartApp.appName;

      mkdirp(path.join(app, 'static', app));
      mkdirp(path.join(app, 'templates', app));
    }
  }
});
