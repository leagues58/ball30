
const Gpio = require('onoff').Gpio;
const sleep = require('sleep');
const model = require('./ball30_system_model.js');
const fs = require('fs');

const triggerDistance = 100; // This value probably needs to change

let pulseStart, pulseEnd, pulseDuration;
let distance;
let minDistance;
let distanceArray = [];

async function ping() {
	await model.insertHeader(new Date(), 1);
	const trig = new Gpio(23, 'out');
	const echo = new Gpio(18, 'in', 'both');
	trig.writeSync(0);
	sleep.msleep(150);

	// send high trigger signal for 10 microseconds
	trig.writeSync(1);
	sleep.usleep(10);
	trig.writeSync(0);

	pulseStart = process.hrtime();

	// save start time (no response)
	while (!echo.readSync()) {
		pulseStart = process.hrtime();
	}

	// save last timestamp of response
	while (echo.readSync()) {
		pulseEnd = process.hrtime();
	}

	// calculate duration of response 
	pulseDuration = (pulseEnd[0] * 1000000 + pulseEnd[1]/1000) - (pulseStart[0] * 1000000 + pulseStart[1]/1000);

	// calculate distance from  duration * speed of sound / 2
	distance = (pulseDuration * .034) / 2

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

	trig.unexport();
	echo.unexport();
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
