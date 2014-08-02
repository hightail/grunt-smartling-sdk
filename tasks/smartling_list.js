/*
 * grunt-smartling-sdk
 * https://github.com/hightail/grunt-smartling-sdk
 *
 * Copyright (c) 2014 Hightail
 * Author: Justin Fiedler
 *
 * Licensed under the ISC license.
 */

'use strict';

module.exports = function (grunt) {
  var SmartlingSdk = require('smartling-sdk'),
      logJson      = require('../lib/log-json')(grunt);

  grunt.registerMultiTask('smartling_list', 'Get a list files in Smartling', function () {
    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options(this.data);

    var sdk = new SmartlingSdk(options.smartling.apiBaseUrl, options.smartling.apiKey, options.smartling.projectId);

    sdk.list()
      .then(function(fileList) {
        logJson(fileList);
        done(fileList);
      })
      .fail(function(error) {
        logJson(error);
        done(false);
      });
  });
};
