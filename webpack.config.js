const path = require('path');

module.exports = {
  entry: './Cube Adventure.js',
  mode: "development",
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};