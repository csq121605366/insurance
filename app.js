require("babel-core/register")({
  presets: ["es2015", "stage-3"],
  plugins: ["transform-es2015-modules-commonjs", "transform-decorators-legacy"]
});

require("babel-polyfill");
require("./server");
