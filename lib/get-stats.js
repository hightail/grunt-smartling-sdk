/**
 * GetStats for multiple calls to Smartling /file/get
 *
 * Copyright (c) 2014 Hightail
 * Author: Justin Fiedler
 */

var GetStats = function () {
  this.stats = {
    fileCount: 0,
    files: {
      succeeded: [],
      failed: []
    }
  };
};

GetStats.prototype.getInfo = function() {
  return this.stats;
};

/**
 * Appends SUCCESS status info from @fileUploadResponse
 *
 * @param fileUri
 * @param fileUploadResponse
 */
GetStats.prototype.appendSuccess = function(fileUri) {
  this.stats.fileCount++;
  this.stats.files.succeeded.push(fileUri);
};

/**
 * Appends ERROR status info for @fileUri
 *
 * @param fileUri
 */
GetStats.prototype.appendError = function(fileUri) {
  this.stats.fileCount++;
  this.stats.files.failed.push(fileUri);
};

module.exports = GetStats;