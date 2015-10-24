/* global describe, it, before, beforeEach, require, __dirname */

'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var fs = require('fs');

describe('django-agility:app', function(){
  var agility;

  var author = 'test_authorName';
  var projectName = 'test-project Name';
  var email = 'test@mail.com';

  var options = { 'skip-install': true };
  var promptsWithoutPreprocessor = {
    author: author,
    email: email,
    projectName: projectName,
    projectPublic: false,
    preprocessor: false
  };
  var promptsWithScssPreprocessor = {
    author: author,
    projectName: projectName,
    projectPublic: false,
    preprocessor: true,
    preprocessorType: 'scss'
  };

  var staticFiles = [
    // Static files:
    'LICENSE.md',
    'MANIFEST.in',
    'README.md',
    'CONTRIBUTING.md',
    'config/config.secret',

    // Package managers:
    'bower.json',
    'package.json',

    // Style guides:
    '.editorconfig',
    '.jshintrc',
    'setup.cfg',

    // VCS:
    '.gitignore',
    '.gitattributes',

    // Requirements:
    'requirements/_base.txt',
    'requirements/_env.txt',
    'requirements/development.txt',
    'requirements/production.txt',
    'requirements/testing.txt',

    // Template files:
    'templates/txt/crossdomain.xml',
    'templates/txt/humans.txt',
    'templates/txt/robots.txt',
    'templates/txt/sitemap.xml',

    'templates/_layouts/base.html',

    'templates/status_pages/400.html',
    'templates/status_pages/403.html',
    'templates/status_pages/404.html',
    'templates/status_pages/500.html',

    // Static files:
    'media',
    'static/build',
    'static/css',
    'static/img',
    'static/js',
    'static/var',

    // Manage file:
    'manage.py'
  ];

  var preprocessorFiles = [
    'main.scss',

    'functions/functions.scss',
    'functions/mixins.scss',

    'modules/all.scss',

    'partials/brand.scss',
    'partials/fixes.scss'
  ];

  var projectFiles = [
    // django_server package:
    '__init__.py',
    'urls.py',
    'wsgi.py',

    // settings:
    'settings/__init__.py',
    'settings/components/__init__.py',
    'settings/components/common.py',
    'settings/environments/__init__.py',
    'settings/environments/development.py',
    'settings/environments/production.py',
    'settings/environments/testing.py'
  ];

  before(function(done){
    helpers.setUpTestDirectory(path.join(__dirname, 'tmp'));
    done();
  });

  beforeEach(function(done){
    helpers.testDirectory(path.join(__dirname, 'tmp'), function(err){
      if (err){
        return done(err);
      }

      agility = helpers.createGenerator(
        'django-agility:app', ['../../app'], false, options);
      done();

    }.bind(this));
  });

  it('tests static files presence', function(done){
    helpers.mockPrompt(agility, promptsWithoutPreprocessor);
    agility.run(function(){
      assert.file(staticFiles);
      done();
    });
  });

  it('tests absence of preprocessor folders', function(done){
    helpers.mockPrompt(agility, promptsWithoutPreprocessor);
    agility.run(function(){
      assert(agility.agility.preprocessorType, 'none');
      assert.noFile(['scss', 'sass', 'less', 'none']);
      done();
    });
  });

  it('tests required preprocessor folder presence', function(done){
    var preprocessorType = promptsWithScssPreprocessor.preprocessorType;

    var paths = [];
    for (var i = 0; i < preprocessorFiles.length; i++){
      paths.push(path.join(preprocessorType, preprocessorFiles[i]));
    }

    helpers.mockPrompt(agility, promptsWithScssPreprocessor);
    agility.run(function(){
      assert.file(paths);
      done();
    });
  });

  it('tests project files', function(done){
    helpers.mockPrompt(agility, promptsWithoutPreprocessor);
    agility.run(function(){
      var normalProjectName = agility.agility.projectName;

      var paths = [];
      for (var i = 0; i < projectFiles.length; i++){
        paths.push([normalProjectName, projectFiles[i]].join('/'));
      }

      assert.file(paths);
      done();
    });
  });

  describe('files\' contents', function(){
    it('tests author\'s name', function(done){
      helpers.mockPrompt(agility, promptsWithoutPreprocessor);
      agility.run(function(){
        var pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        assert(pkg.author.name, agility.agility.author);
        assert(pkg.author.email, agility.agility.email);
        assert(pkg.name, agility.agility.projectName);

        var bower = JSON.parse(fs.readFileSync('bower.json', 'utf8'));
        assert(bower.author.name, agility.agility.author);
        assert(bower.author.email, agility.agility.email);
        assert(bower.name, agility.agility.projectName);

        var pattern = '__author__ = \'' + agility.agility.author + '\'';
        assert.fileContent('manage.py', new RegExp(pattern, 'g'));

        done();
      });
    });
  });

});
