
var Gpio = require('onoff').Gpio;
var LED = new Gpio(10, 'out');
var pushButton = new Gpio(23, 'in', 'both');
pushButton.watch(function (err, value) {
    if (err) {
        console.error ('There was an error', err);
        return;
    }
    LED.writeSync(value);
});

function unexportOnClose(){
    LED.writeSync(0);
    LED.unexport();
    pushButton.unexport();
};

process.on('SIGINT', unexportOnClose);

