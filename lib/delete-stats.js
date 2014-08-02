/**
 * DeleteStats for Smartling file/delete
 *
 * Copyright (c) 2014 Hightail
 * Author: Justin Fiedler
 */

var DeleteStats = function () {
  this.stats = {
    fileCount: 0,
    files: {
      deleted: [],
      failed: []
    }
  };
};

DeleteStats.prototype.getInfo = function() {
  return this.stats;
};

/**
 * Appends SUCCESS info from @fileUri
 *
 * @param fileUri
 */
DeleteStats.prototype.appendSuccess = function(fileUri) {
  this.stats.fileCount++;
  this.stats.files.deleted.push(fileUri);
};

/**
 * Appends ERROR info for @fileUri
 *
 * @param fileUri
 */
DeleteStats.prototype.appendError = function(fileUri) {
  this.stats.fileCount++;
  this.stats.files.failed.push(fileUri);
};

module.exports = DeleteStats;