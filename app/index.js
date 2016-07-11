/*eslint-disable*/
var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
    //  Get details
    prompting: function () {
        var done = this.async();
        this.prompt([{
            type    : 'input',
            name    : 'name',
            message : 'Your project name',
            default : this.appname // Default to current folder name
        }]).then(function (answers) {
            this.props = answers;
            this.log('app name', answers.name);
            done();
        }.bind(this));
    },
    //  Write files
    writing: function() {
        this.fs.copyTpl(
            this.templatePath('_package.json'),
            this.destinationPath('package.json'), 
            {
                name: this.props.name
            }
        );
        this.fs.copyTpl(
            this.templatePath('_README.md'),
            this.destinationPath('README.md'),
            {
                name: this.props.name
            }
        );
        this.fs.copy(
            this.templatePath('_gulpfile.babel.js'),
            this.destinationPath('gulpfile.babel.js')
        );
        this.fs.copy(
            this.templatePath('_.gitignore'),
            this.destinationPath('.gitignore')
        );
        this.fs.copy(
            this.templatePath('_app.js'),
            this.destinationPath('src/app.js')
        );
    },
    //  Install our modules
    install: function() {
        // maybe we should leave this up to the user?
    },

    end: function() {
        console.log('All set! Just run: npm start');
    }
});
