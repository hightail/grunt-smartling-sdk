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
  var asyncUtil    = require('async'),
      SmartlingTask = require('../lib/smartling-task'),
      StatusStats  = require('../lib/status-stats');

  grunt.registerMultiTask('smartling_status', 'Get status of files in Smartling',
    SmartlingTask.make(function (task, options, sdk, done, logJson) {
      var stats = new StatusStats();

      var fileUris = task.getFileUris();

      asyncUtil.eachLimit(fileUris, 10, function(fileUri, callback) {
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
    })
  );
};
