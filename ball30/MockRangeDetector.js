const RangeDetector = require('./RangeDetector.js');

module.exports = class MockRangeDectector extends RangeDetector {
  constructor() {
    super();
  }

  poll() {
    return Math.sin(new Date().getTime());
  }

  dispose() {

  }
}