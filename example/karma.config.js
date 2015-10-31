"use strict";

// Karma configuration
module.exports = function (karmaConfig) {
    function normalizationBrowserName(browser) {
        return browser.toLowerCase().split(/[ /-]/)[0];
    }

    karmaConfig.set({
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: "",

        // How long will Karma wait for a message from a browser before disconnecting from it (in ms).
        browserNoActivityTimeout: 20000,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ["PhantomJS"],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        client: {
            mocha: {
                reporter: "html"
            }
        },

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        coverageReporter: {
            includeAllSources: true,
            reporters: [
                {
                    type: "text",
                    subdir: normalizationBrowserName
                },
                {
                    type: "html",
                    dir: "reports/",
                    subdir: normalizationBrowserName
                }
            ]
        },

        // list of files to exclude
        exclude: [],

        files: [{
            pattern: "./src/test/unit/phantomShims.js",
            included: true,
            watched: false
        }],

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: [
            "phantomjs-shim",
            "chai-sinon",
            "jspm",
            "mocha"
        ],

        jspm: {
            config: "system.config.js",
            loadFiles: ["public/**/*Test.js"],
            serveFiles: [
                "bin/**/*",
                "jspm_packages/**/*",
                "public/**/*"
            ]
        },

        // level of logging
        // possible values: karmaConfig.LOG_DISABLE || karmaConfig.LOG_ERROR || karmaConfig.LOG_WARN || karmaConfig.LOG_INFO || karmaConfig.LOG_DEBUG
        logLevel: karmaConfig.LOG_INFO,

        // web server port
        port: 9876,

        preprocessors: {
            "public/**/*.js": ["sourcemap"],
            "public/!(test)/**/!(*Test).js": ["coverage"]
        },

        // test results reporter to use
        // possible values: "dots", "progress"
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ["coverage", "mocha"],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};
