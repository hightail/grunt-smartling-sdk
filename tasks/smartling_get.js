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
  var SmartlingTask = require('../lib/smartling-task'),
      asyncUtil    = require('async'),
      path         = require('path'),
      GetStats     = require('../lib/get-stats');

  grunt.registerMultiTask('smartling_get', 'Get files from Smartling',
    SmartlingTask.make(function (task, options, sdk, done, logJson) {
      var stats = new GetStats();
      var outputDirectory = options.dest;

      var fileUris = task.getFileUris();

      asyncUtil.eachLimit(fileUris, 10, function (fileUri, callback) {
          var destFilepath;
          if (outputDirectory) {
            destFilepath = path.join(outputDirectory, fileUri);
          }

          sdk.get(fileUri, destFilepath, options.operation)
            .then(function (fileContents) {
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
            .fail(function (error) {
              if (options.verbose) {
                logJson(error);
              }
              stats.appendError(destFilepath || fileUri);
              callback();
            });
        }, function (err) {
          // This is a callback for when all fileUris have completed
          var statusInfo = stats.getInfo();
          logJson(statusInfo);
          if (err || statusInfo.files.failed.length > 0) {
            console.log('ERROR Getting Component Translation files!!!');

            done(statusInfo);
          } else {
            done();
          }
        }
      );
    })
  );
};
