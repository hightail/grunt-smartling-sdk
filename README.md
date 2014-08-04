# grunt-smartling-sdk

> Grunt tasks for smartling-sdk

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-smartling-sdk
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-smartling-sdk');
```

## The "smartling_sdk" task

### Overview
In your project's Gruntfile, add a section for each task you want to use in `grunt.initConfig()`.

```js
grunt.initConfig({
  smartling_list: {
    options: {
      // Task-specific options go here.
      smartling: {
        apiBaseUrl: SmartlingSdk.API_BASE_URLS.SANDBOX,
        apiKey: '',
        projectId: ''
      }
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  }
})
```

### Options

#### options.smartling
Type: `Object`
Default value: `None`

An object with your Smartling API and Project settings. This is require for all smartling tasks

```js
{
  apiBaseUrl: SmartlingSdk.API_BASE_URLS.LIVE,
  apiKey: 'your-api-key',
  projectId: 'your-project-id'
}
```

#### options.operation
Type: `Object`
Default value: `None`

A object that is used to set Smartling options for a given operation (status, get, upload, etc).

Example options.operation for `smartling_upload`

```js
{
  fileType: 'json',
  approved: false
}
```

#### options.fileUriFunc
Type: `Function`
Default value: `None`

When `src` is used to provide files, this function is used to generate fileUri's from the filepaths.

Example in `smartling_upload` this will used each files 'basename' as its fileUri

```js
smartling_upload: {
  options: {
    smartling: { ... },
    operation: {
      fileType: 'json',
      approved: false
    },
    fileUriFunc: function(filepath) {
      return path.basename(filepath);
    }
  },
  default: {
    src: 'path/to/translations/*.json'
  }
}
```

#### options.verbose
Type: `Boolean`
Default value: `false`

If true extra debugging information will be logged to the console.

```js
smartling_status: {
  options: {
    smartling: { ... },
    operation: {
      locale: 'en',
    },
    fileUriFunc: function(filepath) {
      return path.basename(filepath);
    },
    verbose: true
  },
  default: {
    src: 'path/to/translations/*.json'
  }
}
```

### Usage Examples

See Gruntfile.js for usage examples

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2014 Hightail. Licensed under the ISC license.
