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
  // load all npm grunt tasks
  require('load-grunt-tasks')(grunt);

  //Config this with your Smartling settings
  var smartlingOptions = require('./test/smartling-config.json');

  /**
   * Function to generate a fileUri given a @filepath
   *
   * @param filepath
   * @returns {*}
   */
  var fileUriFunc = function(filepath) {
    var slashIndex = filepath.lastIndexOf('/');
    if (slashIndex < 0) {
      slashIndex = 0;
    } else {
      slashIndex++;
    }
    return filepath.slice(slashIndex);
  };

  /**
   * Function to generate a RENAMED fileUri given a @filepath
   *
   * @param filepath
   * @returns {*}
   */
  var renameFileUriFunc = function(fileUri) {
    return 'renamed-' + fileUri;
  };

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      default: ['test/downloads/*']
    },

    // Configuration to be run (and then tested).
    smartling_list: {
      options: {
        smartling: smartlingOptions
      },
      default: {
        options: {
          operation: {
            locale: 'en'
          }
        }
      }
    },

    smartling_status: {
      options: {
        smartling: smartlingOptions,
        operation: {
          locale: 'en'
        },
        fileUriFunc: fileUriFunc,
        verbose: false
      },
      one: {
        src: 'test/fixtures/translations.json'
      },
      all: {
        src: 'test/fixtures/*.json'
      }
    },

    smartling_upload: {
      options: {
        smartling: smartlingOptions,
        operation: {
          fileType: 'json',
          approved: false
        },
        fileUriFunc: fileUriFunc,
        verbose: true
      },
      one: {
        src: 'test/fixtures/translations.json'
      },
      all: {
        src: 'test/fixtures/*.json'
      },
      placeholder: {
        options: {
          operation: {
            fileType: 'json',
            approved: false,
            smartling: {
              placeholder_format_custom: '__.+?__'
            }
          }
        },
        src: 'test/fixtures/*.json'
      }
    },

    smartling_get: {
      options: {
        smartling: smartlingOptions,
        operation: {
          locale: 'en',
          retrievalType: 'published'
        },
        fileUriFunc: fileUriFunc,
        verbose: true
      },
      get: {
        src: 'test/fixtures/*.json'
      },
      dl: {
        src: 'test/fixtures/*.json',
        dest: './test/downloads'
      },
      dl_de: {
        options: {
          operation: {
            locale: 'de-DE'
          }
        },
        src: 'test/fixtures/*.json',
        dest: './test/downloads/de'
      },
      array: {
        locales: [
          'de-DE',
          'en',
          'es',
          'fr',
          'it-IT',
          'nl-NL',
          'pt-BR',
          'ru-RU'
        ],
        src: 'test/fixtures/*.json',
        dest: './test/downloads/array'
      },
      map: {
        options: {
          destFileUriFunc: function(fileUri) {
            return 'mod-' + fileUri;
          }
        },
        locales: {
          'de-DE': 'de',
          'en': 'en',
          'es': 'es',
          'fr': 'fr',
          'it-IT': 'it',
          'nl-NL': 'nl',
          'pt-BR': 'pt-BR',
          'ru-RU': 'ru'
        },
        src: 'test/fixtures/*.json',
        dest: './test/downloads/map/'
      }
    },

    smartling_rename: {
      options: {
        smartling: smartlingOptions,
        fileUriFunc: fileUriFunc,
        newFileUriFunc: renameFileUriFunc,
        verbose: false
      },
      one: {
        src: 'test/fixtures/translations.json'
      },
      all: {
        src: 'test/fixtures/*.json',
        fileUris: [
          'renamed-translations.json',
          'renamed-more-translations.json'
        ]
      }
    },

    smartling_delete: {
      options: {
        smartling: smartlingOptions,
        fileUriFunc: fileUriFunc,
        verbose: false
      },
      one: {
        src: 'test/fixtures/translations.json'
      },
      all: {
        src: 'test/fixtures/*.json'
      },
      list: {
        fileUris: [
          'renamed-translations.json',
          'renamed-more-translations.json',
          'renamed-renamed-translations.json',
          'renamed-renamed-more-translations.json'
        ]
      }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['jshint:all']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['smartling_list']);

};
