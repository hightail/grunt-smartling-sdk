/**
 * GetStats for multiple calls to Smartling /file/rename
 *
 * Copyright (c) 2014 Hightail
 * Author: Justin Fiedler
 */

var RenameStats = function () {
  this.stats = {
    fileCount: 0,
    files: {
      succeeded: [],
      failed: []
    }
  };
};

RenameStats.prototype.getInfo = function() {
  return this.stats;
};

/**
 * Appends SUCCESS status info from @fileUploadResponse
 *
 * @param fileUri
 * @param fileUploadResponse
 */
RenameStats.prototype.appendSuccess = function(fileUri, newFileUri) {
  this.stats.fileCount++;
  this.stats.files.succeeded.push(fileUri + ' => ' + newFileUri);
};

/**
 * Appends ERROR status info for @fileUri
 *
 * @param fileUri
 */
RenameStats.prototype.appendError = function(fileUri) {
  this.stats.fileCount++;
  this.stats.files.failed.push(fileUri);
};

module.exports = RenameStats;