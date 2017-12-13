const MessagingResponse = require('twilio').twiml.MessagingResponse;

// Twilio Credentials
const accountSid = 'ACa004ded62206b79ef632da124706a510';
const authToken = '35f64f640dff678992cee3cdf24f9d16';

// require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);

function sendMessage() {
	client.messages.create({
		to: '+15712512095',
		from: '+12025169967',
		body: 'They call it a Royale with Cheese',
	}).then(
		(message) => console.log(message.sid)
	);
}

module.exports = function(app) {
	app.post('/sms', (req, res) => {
		const twiml = new MessagingResponse();

		twiml.message('The Robots are coming! Head for the hills!');

		res.writeHead(200, {'Content-Type': 'text/xml'});
		res.end(twiml.toString());
	});
};