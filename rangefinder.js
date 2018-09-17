
const Gpio = require('onoff').Gpio;
const sleep = require('sleep');

let pulseStart, pulseEnd, pulseDuration;
let distance

function ping() {
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

	console.log("Distance: " + distance.toFixed(2) + "cm");

	trig.unexport();
	echo.unexport();
}

while (true) {
	ping();
}


