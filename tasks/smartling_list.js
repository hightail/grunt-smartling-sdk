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
  var SmartlingTask = require('../lib/smartling-task');

  grunt.registerMultiTask('smartling_list', 'Get a list files in Smartling',
    SmartlingTask.make(function (task, options, sdk, done, logJson) {
      sdk.list()
        .then(function (fileList) {
          logJson(fileList);
          done();
        })
        .fail(function (error) {
          logJson(error);
          done(false);
        });
    })
  );
};
