(function (module) {
    'use strict';

    var path = require('path'),
        fs = require('fs'),
        simplet = require('simplet'),
        glob = require('glob'),

        JasmineRequireReporter = function(config, logger, helper) {

            var log = logger.create('reporter.jasmine-require-html'),
                reporterConfig = config.jasmineRequireHtml || {
                        basePath: '',
                        outputFile: '_SpecRunner.html',
                        baseUrl: null,
                        requireConfig: null,
                        specPattern: /\.spec\.js$/
                    },
                outputFile = helper.normalizeWinPath(path.resolve(config.basePath, reporterConfig.outputFile)),
                runnerBase = path.dirname(outputFile);

            this.adapters = [];

            this.onRunStart = function(browsers) {

                var filesGlobs = config.files || {},
                    requireConfig = typeof reporterConfig.requireConfig === "object" ? reporterConfig.requireConfig : (function () {

                        var decorateConfig = function (config) {
                                config.baseUrl = reporterConfig.baseUrl || config.baseUrl;
                                return config;
                            },

                        /* jshint evil: true */
                            retrieveDecoratedConfig = new Function('require', 'return ' + fs.readFileSync(reporterConfig.requireConfig, {encoding: "UTF-8"}));
                        /* jshint evil: false */

                        /**
                         * Passes a mocked require.config function as parameter that returns the RequireJS config object,
                         * decorated with our dynamic includes.
                         */
                        return retrieveDecoratedConfig({
                            config: function (config) {
                                return decorateConfig(config);
                            }
                        });

                    }()),
                    specs = [];

                filesGlobs.forEach(function (filesGlob) {
                    if (filesGlob.watched) {

                        var normalizedFilesGlob = helper.normalizeWinPath(path.relative(runnerBase, filesGlob.pattern));

                        glob.sync(normalizedFilesGlob).forEach(function (file) {
                            if (reporterConfig.specPattern.test(file)) {
                                specs.push(file);
                            }
                        });

                    }
                });

                var output = simplet().render( __dirname + '/runner-template.html', {
                    lib: helper.normalizeWinPath(path.relative(runnerBase, __dirname)),
                    specs: specs,
                    requireConfig: requireConfig
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

    JasmineRequireReporter.$inject = ['config', 'logger', 'helper'];

    module.exports = {
        'reporter:jasmine-require-html': ['type', JasmineRequireReporter]
    };

}(module));
