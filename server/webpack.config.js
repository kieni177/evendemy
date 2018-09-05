var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var nodeModulesAndConfig = {
  './developer-config': 'commonjs ./developer-config',
  './config': 'commonjs ./config',
  './plugins/auth.js': 'commonjs ./plugins/auth.js'
};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModulesAndConfig[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: './server.js',
  target: 'node',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'server.js'
  },
  externals: nodeModulesAndConfig
}