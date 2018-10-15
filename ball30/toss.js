const Point = require('./point.js');

class Toss {
    constructor() {
        this.throwChart = [];
    }

    set date(date) {
        this._date = date;
    }

    get date() {
        return this._date;
    }

    set result(message) {
        this._result = message;
    }

    get result() {
        return this._result;
    }

    addPoint(distance) {
        let newPoint = new Point(distance, new Date());
        this.throwChart.push(newPoint);
    }

    calculateThrowHeight() {

    }

    save() {

    }

    setBadThrowResult() {
        this.result = 'This is a bad throw and you are a bad person for doing it.';
    }

    setGoodThrowResult() {
        this.result = 'Good throw!!';
    }
}

module.exports = Toss;