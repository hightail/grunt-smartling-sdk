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
      path         = require('path'),
      logJson      = require('../lib/log-json')(grunt),
      GetStats     = require('../lib/get-stats');

  grunt.registerMultiTask('smartling_get', 'Get files from Smartling', function () {
    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options(this.data);

    var sdk = new SmartlingSdk(options.smartling.apiBaseUrl, options.smartling.apiKey, options.smartling.projectId);
    var stats = new GetStats();
    var outputDirectory = options.dest;

    if (this.files) {
      this.files.forEach(function(file) {
        //logJson(file);
        asyncUtil.eachLimit(file.src, 10, function(filepath, callback) {
          var fileUri = options.fileUriFunc(filepath);
          //logJson(statusInfo);
          var destFilepath;
          if (outputDirectory) {
            destFilepath = path.join(outputDirectory, fileUri);
          }

          sdk.get(fileUri, destFilepath, options.operation)
            .then(function(fileContents) {
              //logJson(fileContents);
              if (outputDirectory) {
                if (options.verbose) {
                  console.log("Successfully saved: " + destFilepath);
                }
              } else {
                if (options.verbose) {
                  logJson(fileContents);
                }
              }
              stats.appendSuccess(destFilepath || fileUri);
              callback();
            })
            .fail(function(error) {
              if (options.verbose) {
                logJson(error);
              }
              stats.appendError(destFilepath || fileUri);
              callback();
            });
        });
      }, function(err) {
        // This is a callback for when all fileUris have completed
        var statusInfo = stats.getInfo();
        logJson(statusInfo);
        if (err || statusInfo.files.failed.length > 0) {
          console.log('ERROR Getting Component Translation files!!!');

          done(statusInfo);
        } else {
          done();
        }
      });
    } else {
      grunt.log.writeln('No files provided.');
      done(false);
    }
  });
};
