let mongo = require('mongodb').MongoClient;
let ObjectId = require('mongodb').ObjectID;
const led = require('./blink');
const say = require('say');
var Gpio = require('onoff').Gpio;
var mqtt = require('mqtt');


var pushButton = new Gpio(23, 'in', 'both');
var callSpeakAgain = true;
var severity = false;
var mongoIdProcessed = [];
var severityMongoId;
const uri = "mongodb+srv://dbUser:dbUserPassword@cluster0-50vmt.mongodb.net/test?retryWrites=true&w=majority";

var mqtt_url = 'mqtt://postman.cloudmqtt.com:13661';
var topic = "test";
var options = {
	clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
	username: 'nrmsbkar',
	password: 'NLcFxH4NOo5d',
	keepalive: 60,
	reconnectPeriod: 1000,
	protocolId: 'MQTT',
	protocolVersion: 4,
	clean: true,
	encoding: 'utf8'
}

pushButton.watch(function(err, value) {
	if (err) {
		console.error("Error Received");
	}
	console.log("Button Pushed");
	led.redTurnOff();
	callSpeakAgain = false;
	updateMongoStatus(severityMongoId.toString());
})


led.green(1);

function updateMongoStatus(id) {
	const client = new mongo(uri, {
		useNewUrlParser: true
	});
	client.connect(err => {
		if (err) throw err;
		const collection = client.db("health").collection("records");
		collection.findOneAndUpdate({
				"_id": ObjectId(id)
			}, {
				$set: {
					"acknowledgement": "true"
				}
			})
			.then((data) => {
				console.log('Data Returned after update', data);
				//	getDataFromMongo();
			})
			.catch((err) => {
				console.error("Error Returned", err);
			})
	})
}

function getDataFromMongo() {
	console.log("Triggering getDataFromMongo");
	const client = new mongo(uri, {
		useNewUrlParser: true
	});
	client.connect(err => {
		const collection = client.db("health").collection("records");
		collection.find({}).toArray(function(err, result) {
			if (err) throw err;
			console.log(result);
			client.close();
			for (let i = 0; i < result.length; i++) {
				console.log(result[i]['_id'].toString());
				console.log(mongoIdProcessed);
				if (mongoIdProcessed.indexOf(result[i]['_id'].toString()) === -1) {
					var node = document.createElement("p");
					elem = result[i];
					let sev = elem.severity;
					let cls, rightCls;
					node.classList.add("list-group-item");
					node.classList.add(cls);
					console.log(elem["message"]);
					var textnode = document.createTextNode(elem.message);
					node.appendChild(textnode);
					mongoIdProcessed.push(result[i]['_id'].toString());
					//setTimeout(getDataFromMongo,1000);
				}

				//setTimeout(getDataFromMongo,1000);
			}
		});
	});
}

//getDataFromMongo();

function callSpeak(msg) {
	//console.log("The message is", msg);
	say.speak(msg, 'voice_kal_diphone', 1.0, (err) => {
		if (err) {
			console.error('Received Error', err);
		}
		console.log("Executed");
		if (callSpeakAgain) {
			setTimeout(callSpeak(msg), 2000);
		}
	});

}

var client = mqtt.connect(mqtt_url, options);
client.on('connect', function(err) {
	client.subscribe(topic, function() {
		client.on('message', function(topic, msg) {
			console.log('The message received', msg.toString());
			message = JSON.parse(msg.toString().replace('Sent from your Twilio trial account - ', ''));
			console.log("Message transformed to JSON", message);
			let incomingSev = message['severity'];
			let incomingMsg = message['msg'];
			let incomingSrcApp = message['source-app'];
			let incomingRegion = message['region'];
			let messageToAnnounce = `For application ${incomingSrcApp},${incomingMsg} in ${incomingRegion}`
			switch (true) {
				case incomingSev === '1':
					cls = 'list-group-item-danger';
					rightCls = 'error';
					severity = true;
					led.green(0);
					led.blink(9);
					break;
				case incomingSev === '2':
					cls = 'list-group-item-warning';
					rightCls = 'warning';
					led.green(0);
					led.blink(10);
					break;
				default:
					rightCls = 'success';
					cls = 'list-group-item-success';
			}
			document.getElementById('status-color').classList.remove('warning');
			document.getElementById('status-color').classList.remove('error');
			document.getElementById('status-color').classList.remove('success');
			document.getElementById('status-color').classList.add(rightCls);
			if (severity) {
				callSpeak(messageToAnnounce);
				return false;
			} else {}
		})
	})
})
