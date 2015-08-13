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
  var asyncUtil      = require('async'),
      SmartlingTask  = require('../lib/smartling-task'),
      UploadStats    = require('../lib/upload-stats'),
      configDefaults = require('./config_defaults');

  grunt.registerMultiTask('smartling_upload', 'Upload files to Smartling',
    SmartlingTask.make(function (task, options, sdk, done, logJson) {
      var stats = new UploadStats();
      var concurrentTransfers = options.concurrentTransfers || configDefaults.concurrentTransfers;

      if (task.files) {
        task.files.forEach(function (file) {
          //logJson(file);

          asyncUtil.eachLimit(file.src, concurrentTransfers, function (filepath, callback) {
            var fileUri = options.fileUriFunc(filepath);

            sdk.upload(filepath, fileUri, options.operation.fileType, options.operation)
              .then(function (fileInfo) {
                //logJson(fileInfo);
                stats.appendSuccess(fileUri, fileInfo);
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
              console.log('ERROR Uploading Component Translation files!!!');

              done(statusInfo);
            } else {
              done();
            }
          });
        });
      }
    })
  );
};
