# grunt-als-build

_Nota bene: This is not actually a registered npm package yet. You will have to download it and use `npm link` (https://docs.npmjs.com/cli/link)_


Concatenate and minify all javascript files and html templates into a single, dojo-readable file

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-als-build --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-als-build');
```

or by using the `load-grunt-tasks` plugin:

```js
require('load-grunt-tasks')(grunt);
```


## The "als_build" task

### Overview
In your project's Gruntfile, add a section named `als_build` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  als_build: {
    target_name: {
  	  options: {
  	    pkgs: {
  	      // list the local packages in dojoConfig that should be built.
  	    }
  	  },
  	  files: {
  	    // list the files to include in the build here.
  	    // see grunt documentation for different structure options
  	  }
    }
  }
});
```

### Options

#### options.pkgs
Type: `Object`

An object listing the local packages in dojoConfig that should be built. 

#### files 
Type: file list

A list of js modules and html templates to be concatenated and minified. (note: this is a sibling to, not within, the `options` object)

See [Grunt documentation](http://gruntjs.com/configuring-tasks#files) for different structure options.

### Usage Examples

For a project with dojoConfig:

```js
var dojoConfig = {
  parseOnLoad: true,
  packages: [{
    name: 'app',
    location: locationPath + 'js/app'
  }, {
    name: 'components',
    location: locationPath + 'js/components'
  }, {
    name: 'config',
    location: locationPath + 'js/config'
  }]
};
```

an `app` target for the `als_build` task looks like this (assuming a `config` module that should be excluded from the build process).

```js
als_build: {
  app: {
    options: {
      pkgs: {
        // list the local packages in dojoConfig that should be built.
        // (don't include config package here)
        'app': 'js/app',
        'components': 'js/components'
      }
    },
    files: {
      'release/js/app.min.js': [
        // all js and html files from the js folder except config
        'js/**/*.js',
        'js/**/*.html',
        '!js/config/*'
      ]
    }
  }
}
```

and `release/index.html` would include a script tag to import the built modules,
and a require statement to the module that kicks off the application.

```html
<script src="js/app.min.js"></script>
<script>
  <!-- Application Entry Point -->
  require(['app/controller']);
</script>
```

## Contributing
todo

## Release History
todo
