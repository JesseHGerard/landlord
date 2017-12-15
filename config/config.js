console.log('read config');

module.exports = {
	"development": {
		"username": process.env.jaws_username,
		"password": process.env.jaws_password,
		"database": 'hpymvb5de1i66bl4',
		"host": process.env.jaws_host,
		"port": 3306,
		"dialect": "mysql"
	},
	"test": {
		"username": process.env.jaws_username,
		"password": process.env.jaws_password,
		"database": 'hpymvb5de1i66bl4',
		"host": process.env.jaws_host,
		"port": 3306,
		"dialect": "mysql"
	},
	"production": {
		"username": process.env.jaws_username,
		"password": process.env.jaws_password,
		"database": 'hpymvb5de1i66bl4',
		"host": process.env.jaws_host,
		"port": 3306,
		"dialect": "mysql"
	}
};
