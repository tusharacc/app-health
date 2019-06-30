var Gpio = require('onoff').Gpio;
let blinkInterval,LED;
exports.blink = function blinkLED(led){
    var LED = new Gpio(led,'out');
    blinkInterval = setInterval(blink(LED), 1000);
}

function blink(LED){
    if (LED.readSync() === 0){
        LED.writeSync(1);
    } else {	    
        LED.writeSync(0);
    }
}

exports.green = function switchGreen(ind){
    var greenLED = new Gpio(11,'out');
    if (ind){
	greenLED.writeSync(1);
    } else {
    	greenLED.writeSync(0);
	    greenLED.unexport();
    }
}

exports.redTurnOff = function endBlink(){
    clearInterval(blinkInterval);
    (new Gpio(09,'out')).writeSync(0);
}

