
var db = require("../models");
const MessagingResponse = require('twilio').twiml.MessagingResponse;


// require the Twilio module and create a REST client
const client = require('twilio')(process.env.twilioSid, process.env.twiloAuthToken);

const replySms = (res) => {
	const twiml = new MessagingResponse();

	twiml.message('The Robots are coming! Head for the hills!');

	res.writeHead(200, {'Content-Type': 'text/xml'});
	res.end(twiml.toString());
};

// store user info in progres of being setup
const newUserSetUp = {};

module.exports = function(app) {
	app.post('/sms', (req, res) => {
		console.log('newUserSetUp:', newUserSetUp);

		// search db for sms sender phone number
		db.Tenant.findOne({
			where: {phone: req.body.From}
		})
		.then(data => {
			// if phone number is not in database
			if (data === null && newUserSetUp[req.body.From] === undefined) {
				// create new tenant
				db.Tenant.create({
					phone: req.body.From,
				});
				// add user to newUserSetUp
				newUserSetUp[req.body.From] = {phone: req.body.From};
			} else if (data.phone === newUserSetUp[data.phone]){

			}
		});
	});
};
