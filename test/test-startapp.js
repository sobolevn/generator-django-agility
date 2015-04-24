'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('DjangoAgility:startapp', function () {
  var agility;
  var djangoAppName = 'Django-App';

  var prompts = { author: 'test-author' };

  before(function(done){
    helpers.setUpTestDirectory(path.join(__dirname, 'tmp'));
    helpers.testDirectory(path.join(__dirname, 'tmp'), function(err){
      if (err) return done(err);
      agility = helpers.createGenerator('django-agility:startapp', ['../../startapp'], djangoAppName);
      helpers.mockPrompt(agility, prompts);
      done();
    }.bind(this));
  });

  it('tests python files presence', function(done){
    var files = [
      // App files:
      '__init__.py',
      'admin.py',
      'forms.py',
      'models.py',
      'urls.py',
      'views.py',

      // Tests:
      'tests/__init__.py',

      // Migrations:
      'migrations/__init__.py'
    ];

    agility.run(function(){
      var expected = [];
      for (var i = 0; i < files.length; i++){
        expected.push(path.join(agility.agilityStartApp.appName, files[i]))
      }

      done(assert.file(expected));
    });
  });

  it('tests static files presence', function(done){
    var files = [
      'static',
      'templates'
    ];

    agility.run(function(){
      var expected = [];
      for (var i = 0; i < files.length; i++){
        expected.push(path.join(files[i], agility.agilityStartApp.appName))
      }

      done(assert.file(expected));
    });
  });

});
