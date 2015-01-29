var path = require('path');
var fs = require('fs');
var simplet = require('simplet');
var glob = require('glob');

var JasmineRunnerReporter = function(config, logger, helper) {

    var log = logger.create('reporter.jasmine-runner');
    var reporterConfig = config.jasmineRunnerReporter || {};
    var outputFile = helper.normalizeWinPath(path.resolve(config.basePath,reporterConfig.outputFile || 'jasmine-runner.html'));
    var tmpl = '<script type="text/javascript" src="$file"></script>';
    var runnerBase = path.dirname(outputFile);

    this.adapters = [];

    this.onRunStart = function(browsers) {

        var files = config.files || {};
        var extensions = reporterConfig.includes || [];
        var specs = [];

        files.forEach(function(file) {
            if (file.watched) {
                var sourceFile = helper.normalizeWinPath(path.relative(runnerBase, file.pattern));
                specs.push(tmpl.replace('$file', sourceFile));
            }
        });

        var includes = [];

        extensions.forEach(function(file) {
            var sourceFile = helper.normalizeWinPath(path.relative(runnerBase, file));
            includes.push(tmpl.replace('$file', sourceFile));
        });
    
        var fileEngine = simplet();
        var output = fileEngine.render( __dirname + '/runner-template.html', {
            lib: helper.normalizeWinPath(path.relative(runnerBase, __dirname)),
            extensions: includes.join('\n  '),
            specs: specs.join('\n  ')
        });
    
        helper.mkdirIfNotExists(path.dirname(outputFile), function() {

            fs.writeFile(outputFile, output, function(err) {
                if (err) {
                    log.warn('Cannot write Jasmine Runner HTML\n\t' + err.message);
                } else {
                    log.debug('Jasmine Runner results written to "%s".', outputFile);
                }
            });

        });

    };

};

JasmineRunnerReporter.$inject = ['config', 'logger', 'helper'];

module.exports = {
  'reporter:jasmine-runner': ['type', JasmineRunnerReporter]
};