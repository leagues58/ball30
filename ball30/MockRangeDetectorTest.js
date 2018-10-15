const MockRangeDectector = require('./MockRangeDetector.js');
const fs = require('fs');

const triggerDistance = 100; // This value probably needs to change

let rangeDector = new MockRangeDectector();
let distance;
let minDistance;
let distanceArray = [];

function ping() {
	distance = rangeDector.poll();

	if (distance < triggerDistance) {
		trackToss(distance, minDistance);
	}

	if (distance > triggerDistance && distanceArray.length > 0 && !(typeof(minDistance) === undefined || minDistance === null)) {
		// save array
		console.table(distanceArray);
		console.log('Throw tracking completed.');
		let toss = createTossObj(distanceArray, 'Good Throw');
		writeToFile(toss);
		distanceArray = [];
    }
    
	console.log("Distance: " + distance.toFixed(2) + "cm");
}

while (true) {
	ping();
}

function trackToss(distance, minDistance) {
	const invalidThrowDistance = 3000; // This value probably needs to change
	if (minDistance === undefined) {
		minDistance = distance;
	} else if (distance - minDistance > invalidThrowDistance) {
		minDistance = null;
		console.log('This is a bad throw and you are a bad person for doing it.');
		// save bad throw
		let toss = createTossObj(distanceArray, 'Bad Throw');
		writeToFile(toss);
		distanceArray = [];
		return false;
	}
	distanceArray.push(minDistance);
	console.log('Measurement tracked.');
}

function createTossObj(distArray, tossMessage) {
	let toss = {};
	toss.Date = new Date();
	toss.Result = tossMessage;
	toss.DistanceArray = distArray;
}

function writeToFile(toss) {
	let jsonData = JSON.stringify(toss);
	fs.writeFile($`results_${new Date()}.json`, jsonData, 'utf8');
}
