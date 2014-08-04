var SmartlingSdk = require('smartling-sdk');

var logJson = function(jsonObject) {
  console.log(JSON.stringify(jsonObject, null, '  '));
};


/**
 * Sets up common settings for Smartling tasks
 *
 * @param taskFunction
 * @returns {Function}
 */
var make = function(taskFunction) {
  return function() {
    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options(this.data);

    if (!options.operation) {
      options.operation = {};
    }

    //default fileUriFunc to use the basename of the filepath
    options.fileUriFunc = options.fileUriFunc || function(filepath) {
      return path.basename(filepath);
    };

    var sdk = new SmartlingSdk(options.smartling.apiBaseUrl, options.smartling.apiKey, options.smartling.projectId);

    this.getFileUris = function() {
      var fileUris = options.fileUris || [];

      if (this.files) {
        this.files.forEach(function (file) {
          file.src.forEach(function (filepath) {
            var fileUri = options.fileUriFunc(filepath);
            fileUris.push(fileUri);
          });
        });
      }

      return fileUris;
    };

    taskFunction(this, options, sdk, done, logJson);
  };
};

//var SmartlingTask = function(grunt) {
//  this.grunt = grunt;
//
//};

module.exports = {
  make: make
};