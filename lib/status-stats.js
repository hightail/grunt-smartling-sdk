/**
 * Stats for multiple calls to Smartling /file/status
 *
 * Copyright (c) 2014 Hightail
 * Author: Justin Fiedler
 */

var StatusStats = function () {
  this.stats = {
    fileCount: 0,
    stringCount: 0,
    fileTypes: [],
    lastUploaded: '0',
    approvedStringCount: 0,
    completedStringCount: 0,
    files: {
      pendingApproval: [],
      pendingTranslation: [],
      failed: []
    }
  };
};

/**
 * Compares 2 DateString's
 * Returns -1, 0, 1 if @dateStr is before, equal or after @otherDateStr respectfully
 *
 * @param dateStr
 * @param otherDateStr
 * @returns {number}
 */
function compareDateStrings(dateStr, otherDateStr) {
  var time = (new Date(dateStr)).getTime();
  var otherTime = (new Date(otherDateStr)).getTime();

  if (time < otherTime) {
    return -1;
  } else if (time > otherTime) {
    return 1;
  } else {
    return 0;
  }
}

StatusStats.prototype.getInfo = function() {
  return this.stats;
};

/**
 * Appends SUCCESS status info from @fileUploadResponse
 *
 * @param fileUri
 * @param fileUploadResponse
 */
StatusStats.prototype.appendSuccess = function(fileUri, fileStatusResponse) {
  this.stats.fileCount++;
  this.stats.stringCount += fileStatusResponse.stringCount;
  this.stats.approvedStringCount += fileStatusResponse.approvedStringCount;
  this.stats.completedStringCount += fileStatusResponse.completedStringCount;

  //Check if this is still pending approval
  if (fileStatusResponse.approvedStringCount < fileStatusResponse.stringCount) {
    this.stats.files.pendingApproval.push(fileStatusResponse.fileUri);
  }

  //Check if this is still pending translation
  if (fileStatusResponse.completedStringCount < fileStatusResponse.stringCount) {
    this.stats.files.pendingTranslation.push(fileStatusResponse.fileUri);
  }

  if (compareDateStrings(fileStatusResponse.lastUploaded, this.stats.lastUploaded) > 0) {
    this.stats.lastUploaded = fileStatusResponse.lastUploaded;
  }

  if (this.stats.fileTypes.indexOf(fileStatusResponse.fileType) < 0) {
    this.stats.fileTypes.push(fileStatusResponse.fileType);
  }
};

/**
 * Appends ERROR status info for @fileUri
 *
 * @param fileUri
 */
StatusStats.prototype.appendError = function(fileUri) {
  this.stats.fileCount++;
  this.stats.files.failed.push(fileUri);
};

module.exports = StatusStats;