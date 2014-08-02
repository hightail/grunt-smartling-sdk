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
      asyncUtil    = require('async'),
      logJson      = require('../lib/log-json')(grunt),
      StatusStats  = require('../lib/status-stats');

  grunt.registerMultiTask('smartling_status', 'Get status of files in Smartling', function () {
    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options(this.data);

    var sdk = new SmartlingSdk(options.smartling.apiBaseUrl, options.smartling.apiKey, options.smartling.projectId);

    var stats = new StatusStats();

    if (this.files) {
      this.files.forEach(function(file) {
        //logJson(file);

        asyncUtil.eachLimit(file.src, 10, function(filepath, callback) {
          var fileUri = options.fileUriFunc(filepath);

          sdk.status(fileUri, options.operation.locale)
            .then(function(statusInfo) {
              if (options.verbose) {
                logJson(statusInfo);
              }
              stats.appendSuccess(fileUri, statusInfo);
              callback();
            })
            .fail(function(error) {
              if (options.verbose) {
                logJson(error);
              }
              stats.appendError(fileUri);
              callback();
            });
        }, function(err) {
          // This is a callback for when all fileUris have completed
          var statusInfo = stats.getInfo();
          logJson(statusInfo);
          if (err || statusInfo.files.failed.length > 0) {
            console.log('ERROR Getting status of files from Smartling!!!');

            done(statusInfo);
          } else {
            done();
          }
        });
      });
    } else {
      grunt.log.writeln('No files provided.');
      done(false);
    }
  });
};
