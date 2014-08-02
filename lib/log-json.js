/**
 * Log's a JSON object as a pretty string
 *
 * @param jsonObject
 */


module.exports = function(grunt) {
  return function logJson(jsonObject) {
    grunt.log.writeln(JSON.stringify(jsonObject, null, '  '));
  };
};