
const issues = require('../config/issues.js');
const db = require("../models");
const MessagingResponse = require('twilio').twiml.MessagingResponse;


// require the Twilio module and create a REST client
const client = require('twilio')(process.env.twilioSid, process.env.twiloAuthToken);


// store user info in progres of being setup
const newUserSetUp = {};

module.exports = function(app) {
	app.get('/newBuildingPhone/:state/:city', (req, res) => {
		console.log(req.params.city);
		db.AreaCode.findOne({
			where: {city: req.params.city, state: req.params.state}
		}).then(areaData => {
			client.availablePhoneNumbers('US').local
			  .list({
			    areaCode: areaData.code.toString(),
			  })
			  .then((data) => {
			    const number = data[0];
			    return client.incomingPhoneNumbers.create({
			      phoneNumber: number.phoneNumber,
			    });
			  })
			  .then((purchasedNumber) => console.log(purchasedNumber.sid))
				.catch(err => console.log(err));

			res.end();
		});
	});


	// receive sms from twilio webhook
	app.post('/sms', (req, res) => {
		console.log('req', req.body);
		const userFrom = req.body.From;

		// search db for sms sender phone number
		db.Tenant.findOne({
			where: {phone: userFrom}
		})
		.then(data => {
			// if phone number is not in database
			if (data === null && newUserSetUp[userFrom] === undefined) {
				// get building data (address) from To phone number
				db.Building.findOne({phone: req.body.To}).then(building => {
					// create new tenant
					db.Tenant.create({
						phone: userFrom,
						BuildingId: building.id,
						userType: 'tenant'
					}).then(result => {
						// add user to newUserSetUp, and ask name
						newUserSetUp[userFrom] = {phone: userFrom, nameStatus: false};
						console.log(`Phone Number added to Database: newUserSetUp: ${newUserSetUp}`);
						const twiml = new MessagingResponse();
						twiml.message('Thanks for submitting your issue. Please answer 2 quick questions to set up an account:');
						twiml.message('1. What is your first name?');
						res.writeHead(200, {'Content-Type': 'text/xml'});
						res.end(twiml.toString());
					});
				})

			}
			// user is in newUserSetUp
			else if (data !== null && newUserSetUp[userFrom] !== undefined) {
				console.log(`User is in newUserSetup\nnewUserSetup: ${newUserSetUp}`)
				// name is not defined yet
				if (newUserSetUp[userFrom].nameStatus === false) {
					newUserSetUp[userFrom].name = req.body.Body;
					// add name to database
					db.Tenant.update(
						{name: req.body.Body},
						{where: {phone: data.phone}}
					).then(result => {
						newUserSetUp[userFrom].nameStatus = true;
						newUserSetUp[userFrom].aptStatus = false;
						// send appartment number request
						const twiml = new MessagingResponse();
						twiml.message(`Thanks ${req.body.Body} \n2. What is your apparment number?`);
						res.writeHead(200, {'Content-Type': 'text/xml'});
						res.end(twiml.toString());
					});
				}
				// appartment is not defined
				else if (newUserSetUp[userFrom].aptStatus === false) {
					newUserSetUp[userFrom].apt = req.body.Body;
					// add apt to database
					db.Tenant.update(
						{apt: req.body.Body},
						{where: {phone: data.phone}}
					).then(result => {
						delete newUserSetUp[userFrom];
						// send setup success sms
						const twiml = new MessagingResponse();
						twiml.message(`Setup complete! You can now text all your building issues to this number. To make changes to your account, please visit ${process.env.siteUrl}/phone-signup/${data.uuid}`);
						res.writeHead(200, {'Content-Type': 'text/xml'});
						res.end(twiml.toString());
					});
				} else {
					// error message
					const twiml = new MessagingResponse();
					twiml.message(`There was an error setting up your account. Please go to ${process.env.siteUrl} to finish setup.`);
					res.writeHead(200, {'Content-Type': 'text/xml'});
					res.end(twiml.toString());
				};
			}
			// if user is in database and is not in newUserSetUp

			else if (data !== null && newUserSetUp[userFrom] === undefined) {
				// process issue
				let description = req.body.Body.trim();
				let messageArray = description.split(' '), qty, category, issueClass;

				for (item of messageArray) {
					let search = issues.search(item);
					console.log(`search: ${JSON.stringify(search)}`);
					if (search) {
						category = search.category;
						issueClass = search.class;
					} else if (parseInt(item)) {
						qty = parseInt(item);
					};
				};
				// add issue to db
				if (!qty) qty = 1;
				if (!category) {
					category = 'message';
					issueClass = 'message';
				};

				db.Issue.create({
					description: description,
					quantity: qty,
					category: category,
					class: issueClass,
					TenantUuid: data.uuid,
					BuildingId: data.BuildingId
				}).then(issueRes => {
					// respond with issue summary
					db.Issue.sum('quantity', {where: {category: category}}).then(sum => {
						let issueCondition;
						if (category === 'message') {
							issueCondition = 'messages';
						} else {
							issueCondition = category;
						};

						const twiml = new MessagingResponse();
						twiml.message(`Thanks for submitting your issue. There have been ${sum} ${issueCondition} reported in the last day`);
						res.writeHead(200, {'Content-Type': 'text/xml'});
						res.end(twiml.toString());
					});

				});
			};

		}).catch(error => console.log(error));
	});
};
