// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function (config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'app/bower_components/ionic/release/js/ionic.bundle.js',
      // 'app/bower_components/fastclick/lib/fastclick.js',
      'app/bower_components/angular/angular.min.js',
      // 'app/bower_components/ionic/release/js/ionic-angular.min.js',
      // 'app/bower_components/ionic/release/js/angular/angular-animate.min.js',
      // 'app/bower_components/ionic/release/js/angular/angular-resource.js',
      // 'app/bower_components/ionic/release/js/angular/angular-cookies.js',
      // 'app/bower_components/ionic/release/js/angular/angular-sanitize.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-touch/angular-touch.js',
      // 'app/bower_components/ionic/dist/js/angular-ui/angular-ui-router.min.js',
      'app/bower_components/angular-mocks/angular-mocks.js',

      'app/scripts/scripts.js',
      'test/mock/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};