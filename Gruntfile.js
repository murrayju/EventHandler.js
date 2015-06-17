/*jslint node:true, vars:true, nomen:true */
module.exports = function (grunt) {
    'use strict';

    var _ = require('lodash');
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    var saveFileWithHeader = function (path, text, banner) {
        grunt.file.write(grunt.template.process(path), grunt.template.process(banner) + text);
    };

    // Project configuration.
    grunt.initConfig({
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> | (c) <%= grunt.template.today("yyyy") %> Justin Murray | built on <%= grunt.template.today("yyyy-mm-dd") %> */\n',

        // download external deps
        bower: {
            install: {
                options: {
                    targetDir: 'src/lib',
                    layout: 'byComponent',
                    cleanTargetDir: true
                }
            }
        },

        // Dependency management and minification
        requirejs: {
            options: {
                baseUrl: "src/js/",
                siteRoot: "src/",
                name: "almond",
                optimize: 'none',
                optimizeCss: "standard",
                inlineText: true,
                stubModules: ['less', 'text', 'cs'],
                exclude: ['coffee-script'],
                preserveLicenseComments: false,
                paths: {
                    // Inlined dependencies
                    q: '../lib/q/q',

                    // requirejs plugins
                    cs: '../lib/require-cs/cs',

                    // build tools
                    'coffee-script': '../lib/coffee-script/extras/coffee-script',
                    almond: "../lib/almond/almond"
                }
            },
            mod: {
                options: {
                    include: ['cs!EventHandler'],
                    wrap: {
                        startFile: 'src/js/wrap/start.frag',
                        endFile: 'src/js/wrap/end.frag'
                    },
                    out: function (text) {
                        saveFileWithHeader("dist/EventHandler.js", text, "<%= banner %>");
                    }
                }
            }
        },

        uglify: {
            options: {
                preserveComments: false,
                sourceMap: true,
                report: "gzip",
                banner: "<%= banner %>"
            },
            mod: {
                files: {
                    'dist/EventHandler.min.js': ['dist/EventHandler.js']
                }
            }
        },

        clean: ['dist', 'reports'],

        coffeelint: {
            options: {
                max_line_length: {
                    level: 'warn',
                    value: 120
                }
            },
            app: {
                src: ['src/js/**/*.coffee']
            }
        },

        // Karma test runner
        karma: {
            app: {
                options: {

                    // base path that will be used to resolve all patterns (eg. files, exclude)
                    basePath: '',

                    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
                    frameworks: ['jasmine', 'requirejs'],

                    // list of files / patterns to load in the browser
                    files: [
                        'test/karma/test-main.js',
                        {pattern: 'test/karma/**/*', included: false},
                        {pattern: 'test/data/**/*', included: false},
                        {pattern: 'src/**/*', included: false}
                    ],

                    preprocessors: {
                        'src/{js,js/!(lib)}/*.{js,coffee}': ['coverage']
                    },

                    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
                    reporters: ['dots', 'junit', 'coverage'],
                    junitReporter: {
                        outputFile: 'reports/karma-results.xml'
                    },
                    coverageReporter: {
                        instrumenters: { ibrik : require('ibrik') },
                        instrumenter: {
                            '**/*.coffee': 'ibrik'
                        },
                        includeAllSources: true,
                        dir: 'reports/coverage/',
                        subdir: function (browser) {
                            // normalization process to keep a consistent browser name
                            return browser.toLowerCase().split(/[ \/\-]/)[0];
                        }
                    },

                    // web server port
                    port: 9876,

                    // enable / disable colors in the output (reporters and logs)
                    colors: true,

                    logLevel: 'INFO',

                    // enable / disable watching file and executing tests whenever any file changes
                    autoWatch: false,

                    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
                    browsers: [
                        'Chrome',
                        'Firefox'
                    ],

                    customLaunchers: {
                        IE9: {
                            base: 'IE',
                            'x-ua-compatible': 'IE=EmulateIE9'
                        },
                        IE10: {
                            base: 'IE',
                            'x-ua-compatible': 'IE=EmulateIE10'
                        },
                        bs_ie_11: {
                            base: 'BrowserStack',
                            browser: 'ie',
                            browser_version: '11.0',
                            os: 'windows',
                            os_version: '8.1'
                        },
                        bs_firefox_mac: {
                            base: 'BrowserStack',
                            browser: 'firefox',
                            os: 'OS X',
                            os_version: 'Yosemite'
                        },
                        bs_chrome_mac: {
                            base: 'BrowserStack',
                            browser: 'chrome',
                            os: 'OS X',
                            os_version: 'Yosemite'
                        }
                    },

                    browserStack: {
                        project: 'ThinEditor'
                    },

                    // Continuous Integration mode
                    // if true, Karma captures browsers, runs the tests and exits
                    singleRun: true,
                    captureTimeout: 60000,
                    browserNoActivityTimeout: 100000
                }
            }
        },

        // Test web server
        connect: {
            dev: {
                options: {
                    port: 9000,
                    debug: true,
                    keepalive: true,
                    open: 'http://localhost:9000/test/impl'
                }
            }
        },

        forever: {
            testServer: {
                options: {
                    index: 'testServer.js'
                }
            }
        }
    });

    var gitCmd = function (args, success, fail) {
        grunt.util.spawn({
            cmd: 'git',
            args: args
        }, function (error, result) {
            if (!error && result && result.stdout) {
                success(result.stdout);
            } else {
                fail(error);
            }
        });
    };

    grunt.registerTask('gitInfo', 'Gets info from the current git repo', function () {
        var info = {};
        var done = this.async();

        gitCmd(['rev-parse', '--abbrev-ref', 'HEAD'], function (branch) {
            info.branch = branch.replace(/[_+]/g, '-');

            gitCmd(['rev-parse', '--short=12', 'HEAD'], function (rev) {
                info.revId = rev.replace(/[+]/g, '');
                grunt.config.set('gitInfo', info);
                done();
            }, function (err) {
                grunt.log.writeln('git rev failed: ' + err);
                done(false);
            });

        }, function (err) {
            grunt.log.writeln('git branch failed: ' + err);
            done(false);
        });
    });

    var injectVersion = function (vers, template, output) {
        var pkg = grunt.file.readJSON(template);
        pkg.version = vers;
        grunt.file.write(output, JSON.stringify(pkg, null, 2));
        return pkg;
    };

    grunt.registerTask('parseVers', 'Read version from file, and apply', function () {
        var version = grunt.file.readJSON('version.json');
        // Allow the build to be set from the command line: grunt --buildNum=123
        version.build = grunt.option('buildNum') || 0;
        version.info = '<%= version.major %>.<%= version.minor %>.<%= version.patch %>+<%= version.build %>.<%= gitInfo.branch %>.<%= gitInfo.revId %>';
        grunt.config.set('version', version);
        var infoVers = grunt.template.process(version.info);
        grunt.log.writeln('Current build version: ' + infoVers);

        var pkg = injectVersion(infoVers, 'package.templ.json', 'package.json');
        grunt.config.set('pkg', pkg);
        injectVersion(infoVers, 'bower.templ.json', 'bower.json');
    });

    grunt.registerTask('test', "Run tests on the code", function () {
        grunt.task.run('coffeelint');
        if (!grunt.option('noKarma')) {
            var opts = grunt.config.get('karma.app.options');

            var browsers = _.union(_.keys(opts.customLaunchers), opts.browsers, [
                'PhantomJS',
                'Opera',
                'Safari',
                'IE'
            ]);
            _.forEach(browsers, function (b) {
                if (grunt.option('only-' + b)) {
                    opts.browsers = [b];
                    return false;
                }
                if (grunt.option('no-' + b)) {
                    opts.browsers = _.without(opts.browsers, b);
                } else if (grunt.option('with-' + b)) {
                    opts.browsers.push(b);
                }
            });

            if (grunt.option('testDebug')) {
                opts.singleRun = false;
                opts.autoWatch = true;
                opts.preprocessors = [];
            }

            grunt.config.set('karma.app.options', opts);

            grunt.task.run('karma');
        }
    });

    grunt.registerTask('dev', ['connect:dev']);
    grunt.registerTask('prebuild', ['gitInfo', 'parseVers', 'npm-install', 'bower']);
    grunt.registerTask('deps', ['prebuild', 'npm-install', 'bower']);
    grunt.registerTask('build', ['clean', 'deps', 'requirejs', 'uglify']);
    grunt.registerTask('default', ['build', 'test']);
};
