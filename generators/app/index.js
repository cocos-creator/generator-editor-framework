'use strict';

var Yeoman = require('yeoman-generator');
var Chalk = require('chalk');
var Yosay = require('yosay');
var _ = require('lodash');

module.exports = Yeoman.generators.Base.extend({
  constructor: function () {
    Yeoman.generators.Base.apply(this,arguments);

    this.argument('projectName', { type: String, required: false, desc: 'The project name' });

    this.config.defaults({
      projectName: _.kebabCase(this.appname),
      repo: 'organization/' + _.kebabCase(this.appname),
      copyEntryFile: true,
    });
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(Yosay(
      'Welcome to the posh ' + Chalk.red('editor-framework') + ' generator!'
    ));

    var prompts = [];

    // projectName
    if ( !this.projectName ) {
      prompts.push({
        type: 'input',
        name: 'projectName',
        message: 'Your project name',
        default: this.config.get('projectName'),
      });
    }

    // repo
    prompts.push({
      type: 'input',
      name: 'repo',
      message: 'Your repo path',
      default: this.config.get('repo'),
    });

    //
    prompts.push({
      type: 'confirm',
      name: 'copyEntryFile',
      message: 'Generate "app.js" and "index.html" to your project?',
      default: this.config.get('copyEntryFile'),
    });

    this.prompt(prompts, function (answers) {
      if ( answers.projectName ) {
        this.projectName = answers.projectName;
      }
      this.projectName = _.kebabCase(this.projectName);

      this.config.set( 'projectName', this.projectName );
      this.config.set( 'repo', answers.repo );
      this.config.set( 'copyEntryFile', answers.copyEntryFile );

      this.templateData = {
        projectName: this.projectName,
        repo: answers.repo,
      };

      done();
    }.bind(this));
  },

  configuring: function () {
    this.config.save();
  },

  writing: {
    app: function () {
      if ( this.config.get('copyEntryFile') ) {
        this.copy('app.js', 'app.js');
        this.template('index.tmpl.html', 'index.html', this.templateData);
      }

      this.template('bower.tmpl.json', 'bower.json', this.templateData);
      this.template('package.tmpl.json', 'package.json', this.templateData);
      this.template('gulpfile.tmpl.js', 'gulpfile.js', this.templateData);
    },

    utils: function () {
      this.template('utils/rm-settings.tmpl.sh', 'utils/rm-settings.sh', this.templateData);

      this.copy('utils/gulp-tasks/electron-tasks.js', 'utils/gulp-tasks/electron-tasks.js');
      this.copy('utils/gulp-tasks/setup-tasks.js', 'utils/gulp-tasks/setup-tasks.js');
      this.template('utils/gulp-tasks/minimize-tasks.tmpl.js', 'utils/gulp-tasks/minimize-tasks.js', this.templateData);
      this.template('utils/gulp-tasks/release-tasks.tmpl.js', 'utils/gulp-tasks/release-tasks.js', this.templateData);

      this.copy('utils/libs/check-deps.js', 'utils/libs/check-deps.js');
      this.copy('utils/libs/git.js', 'utils/libs/git.js');
      this.copy('utils/libs/setup-mirror.js', 'utils/libs/setup-mirror.js');

      this.copy('utils/git-commit.sh', 'utils/git-commit.sh');
      this.copy('utils/git-pull.sh', 'utils/git-pull.sh');
      this.copy('utils/git-push.sh', 'utils/git-push.sh');
      this.copy('utils/git-status.sh', 'utils/git-status.sh');
      this.copy('utils/run-tests.js', 'utils/run-tests.js');
      this.copy('utils/run.js', 'utils/run.js');

      this.copy('utils/res/atom.icns', 'utils/res/atom.icns');
      this.copy('utils/res/atom.ico', 'utils/res/atom.ico');
    },

    config: function () {
      this.copy('config/editorconfig', '.editorconfig');
      this.copy('config/gitignore', '.gitignore');
      this.copy('config/jshintrc', '.jshintrc');
    },

    misc: function () {
      this.copy('misc/LICENSE.md', 'LICENSE.md');
      this.template('misc/CONTRIBUTING.tmpl.md', 'CONTRIBUTING.md', this.templateData);
      this.template('misc/README.tmpl.md', 'README.md', this.templateData);
    },

    finish: function () {
      this.config.save();
    },

    // DISABLE
    // gitrepo: function () {
    //   var done = this.async();
    //   this.spawnCommand('git', [
    //     'clone',
    //     'git@github.com:fireball-x/editor-framework.git',
    //     'editor-framework'
    //   ], function() {
    //     done();
    //   });
    // },
  },

  install: function () {
    this.installDependencies();
  }
});
