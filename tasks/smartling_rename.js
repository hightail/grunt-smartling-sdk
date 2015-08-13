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
  var SmartlingTask  = require('../lib/smartling-task'),
      asyncUtil      = require('async'),
      path           = require('path'),
      RenameStats    = require('../lib/rename-stats'),
      configDefaults = require('./config_defaults');

  grunt.registerMultiTask('smartling_rename', 'Rename files in Smartling',
    SmartlingTask.make(function (task, options, sdk, done, logJson) {
      var stats = new RenameStats();
      var concurrentTransfers = options.concurrentTransfers || configDefaults.concurrentTransfers;

      var fileUris = task.getFileUris();

      asyncUtil.eachLimit(fileUris, concurrentTransfers,
        function (fileUri, callback) {
          var newFileUri = options.newFileUriFunc(fileUri);

          sdk.rename(fileUri, newFileUri)
            .then(function () {
              stats.appendSuccess(fileUri, newFileUri);
              callback();
            })
            .fail(function (error) {
              if (options.verbose) {
                logJson(error);
              }
              stats.appendError(fileUri);
              callback();
            });
        },
        function (err) {
          // This is a callback for when all fileUris have completed
          var statusInfo = stats.getInfo();
          logJson(statusInfo);
          if (err || statusInfo.files.failed.length > 0) {
            console.log('ERROR Renaming Component Translation files!!!');

            done(statusInfo);
          } else {
            done();
          }
        }
      );
    })
  );
};
