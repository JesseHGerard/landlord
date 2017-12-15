const checkEnv = () => {

	const requireKeys = () => {
		return new Promise((resolve, reject) => {
			const keys = require('./keys.js');
			resolve(keys);
		});
	};

	return new Promise(resolve => {

		// define keys that need to be added regardless of environment here
		process.env.siteUrl = 'https://serfbord.herokuapp.com';

		if (process.env.heroku){
			console.log("env is heroku, using available process.env's")
			resolve('heroku');
		} else {
			console.log('env is not heroku, overwriting with local keys.js');
			requireKeys().then( keys => {

				// define process.env's here, must be same as heroku env's.
				process.env.PORT = 3000;
				process.env.twilioPhoneNumber = keys.twilioPhoneNumber;
				process.env.twilioSid = keys.twilioSid;
				process.env.twiloAuthToken = keys.twiloAuthToken;
				process.env.jaws_host = keys.jaws_host;
				process.env.jaws_username = keys.jaws_username;
				process.env.jaws_password = keys.jaws_password;

				resolve('local');
			});
		}
	});
};

module.exports = checkEnv;
