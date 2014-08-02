/**
 * UploadStats for Smartling file/upload
 *
 * Copyright (c) 2014 Hightail
 * Author: Justin Fiedler
 */

var UploadStats = function () {
  this.stats = {
    fileCount: 0,
    wordCount: 0,
    stringCount: 0,
    files: {
      uploaded: [],
      overWritten: [],
      failed: []
    }
  };
};

UploadStats.prototype.getInfo = function() {
  return this.stats;
};

/**
 * Appends SUCCESS status info from @fileUploadResponse
 *
 * @param fileUri
 * @param fileUploadResponse
 */
UploadStats.prototype.appendSuccess = function(fileUri, fileUploadResponse) {
  this.stats.fileCount++;
  this.stats.files.uploaded.push(fileUri);
  if (fileUploadResponse) {
    this.stats.stringCount += fileUploadResponse.stringCount;
    this.stats.wordCount += fileUploadResponse.wordCount;

    if (fileUploadResponse.overWritten) {
      this.stats.files.overWritten.push(fileUri);
    }
  }
};

/**
 * Appends ERROR status info for @fileUri
 *
 * @param fileUri
 */
UploadStats.prototype.appendError = function(fileUri) {
  this.stats.fileCount++;
  this.stats.files.failed.push(fileUri);
};

module.exports = UploadStats;