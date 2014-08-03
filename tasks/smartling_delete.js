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
      DeleteStats  = require('../lib/delete-stats');

  grunt.registerMultiTask('smartling_delete', 'Delete files from Smartling',
    SmartlingTask.make(function (task, options, sdk, done, logJson) {
      var stats = new DeleteStats();

      var fileUris = task.getFileUris();

      asyncUtil.eachLimit(fileUris, 10, function (fileUri, callback) {
        sdk.delete(fileUri)
          .then(function () {
            //file deleted successfully
            stats.appendSuccess(fileUri);
            callback();
          })
          .fail(function (error) {
            if (options.verbose) {
              logJson(error);
            }
            stats.appendError(fileUri);
            callback();
          });
      }, function (err) {
        // This is a callback for when all fileUris have completed
        var statusInfo = stats.getInfo();
        logJson(statusInfo);
        if (err || statusInfo.files.failed.length > 0) {
          console.log('ERROR(S) Deleting Component Translation files!!!');

          done(statusInfo);
        } else {
          done();
        }
      });
    })
  );
};
