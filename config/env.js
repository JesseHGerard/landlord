const checkEnv = () => {
	const requireKeys = () => {
		return new Promise((resolve, reject) => {
			const keys = require('./keys.js');
			resolve(keys);
		});
	};

	return new Promise(resolve => {
		if (!process.env.heroku) {
			console.log('env is not heroku, overwriting with local keys.js');
			requireKeys().then( keys => {

				// define process.env's here, must be same as heroku env's.
				process.env.PORT = 3000;
				process.env.twilioPhoneNumber = keys.twilioPhoneNumber;
				process.env.twilioSid = keys.twilioSid;
				process.env.twiloAuthToken = keys.twiloAuthToken;

				resolve('local');
			});
		} else {
			resolve('heroku');
		};
	});
};

module.exports = checkEnv;
