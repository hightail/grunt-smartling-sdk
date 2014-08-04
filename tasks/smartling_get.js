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
      _            = require('lodash'),
      path         = require('path'),
      GetStats     = require('../lib/get-stats');

  grunt.registerMultiTask('smartling_get', 'Get files from Smartling',
    SmartlingTask.make(function (task, options, sdk, done, logJson) {
      var stats = new GetStats();
      var outputDirectory = options.dest;

      var fileUris = task.getFileUris();
      var destFileUriFunc = options.destFileUriFunc || function(fileUri) {
        return fileUri;
      };

      //This is a map of locales of the form:
      // { 'smartlingLocale': 'localeOutputDirectoryName' }
      var localeMap = {};

      var locales = [];
      if (_.isArray(options.locales)) {
        locales = options.locales;
      } else if (_.isObject(options.locales)) {
        //user provided their own mapping
        localeMap = options.locales;
        locales = _.keys(localeMap);
      } else if (options.operation.locale) {
        //This is a single locale request
        locales = [options.operation.locale];
      }

      asyncUtil.each(locales, function(locale, localeCallback) {
        asyncUtil.eachLimit(fileUris, 10, function (fileUri, fileCallback) {
            var destFilepath;
            if (outputDirectory) {
              //check to modufy the destination fileUri
              var destFileUri = destFileUriFunc(fileUri);
              //set the destination directory for the current locale
              var destLocaleDir = localeMap[locale] || locale;
              destFilepath = path.join(outputDirectory, destLocaleDir, destFileUri);
            }

            //set locale
            options.operation.locale = locale;

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
                fileCallback();
              })
              .fail(function (error) {
                if (options.verbose) {
                  logJson(error);
                }
                stats.appendError(destFilepath || fileUri);
                fileCallback();
              });
          }, function (err) {
            localeCallback(err);
          }
        );
      }, function (err) {
        // This is a callback for when all locales have completed
        var statusInfo = stats.getInfo();
        logJson(statusInfo);
        if (err || statusInfo.files.failed.length > 0) {
          console.log('ERROR Getting Component Translation files!!!');

          done(statusInfo);
        } else {
          done();
        }
      });
    })
  );
};
