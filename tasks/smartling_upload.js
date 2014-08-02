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
      UploadStats  = require('../lib/upload-stats');

  grunt.registerMultiTask('smartling_upload', 'Upload files to Smartling', function () {
    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options(this.data);

    var sdk = new SmartlingSdk(options.smartling.apiBaseUrl, options.smartling.apiKey, options.smartling.projectId);
    var stats = new UploadStats();

    if (this.files) {
      this.files.forEach(function(file) {
        //logJson(file);

        asyncUtil.eachLimit(file.src, 10, function(filepath, callback) {
          var fileUri = options.fileUriFunc(filepath);

          sdk.upload(filepath, fileUri, options.operation.fileType)
            .then(function(fileInfo) {
              //logJson(fileInfo);
              stats.appendSuccess(fileUri, fileInfo);
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
            console.log('ERROR Uploading Component Translation files!!!');

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
