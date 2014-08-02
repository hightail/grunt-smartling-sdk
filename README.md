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

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  smartling_sdk: {
    options: {},
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
})
```

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  smartling_sdk: {
    options: {
      separator: ': ',
      punctuation: ' !!!',
    },
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2014 Hightail. Licensed under the ISC license.
