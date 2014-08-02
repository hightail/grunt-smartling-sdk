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
      DeleteStats  = require('../lib/delete-stats');

  grunt.registerMultiTask('smartling_delete', 'Delete files from Smartling', function () {
    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options(this.data);

    var sdk = new SmartlingSdk(options.smartling.apiBaseUrl, options.smartling.apiKey, options.smartling.projectId);
    var stats = new DeleteStats();

    if (this.files) {
      this.files.forEach(function(file) {
        //logJson(file);

        asyncUtil.eachLimit(file.src, 10, function(filepath, callback) {
          var fileUri = options.fileUriFunc(filepath);

          sdk.delete(fileUri)
            .then(function() {
              //file deleted successfully
              stats.appendSuccess(fileUri);
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
            console.log('ERROR(S) Deleting Component Translation files!!!');

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
