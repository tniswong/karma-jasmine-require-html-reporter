# karma-jasmine-runner-reporter

> Reporter to create Jasmine Runner HTML on the fly. 

## Installation

The easiest way is to keep `karma-jasmine-runner-reporter` as a devDependency in your `package.json`.
```json
{
  "devDependencies": {
    "karma": "~0.10",
    "karma-jasmine-runner-reporter": "~0.1"
  }
}
```

You can simple do it by:
```bash
npm install karma-jasmine-runner-reporter --save-dev
```

## Configuration
Following code shows the default configuration...
```js
// karma.conf.js
// karma.conf.js
module.exports = function(config) {
  config.set({
    reporters: ['progress', 'jasmine-runner'],

    // the default configuration
    jasmineRunnerReporter: {
      outputFile: 'jasmine-runner.html'
    }
  });
};
```

----

For more information on Karma see the [homepage].


[homepage]: http://karma-runner.github.com