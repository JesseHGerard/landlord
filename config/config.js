module.exports = {
	"development": {
		"username": "root",
		"password": "",
		"database": "roach_motel",
		"host": "localhost",
		"port": 3306,
		"dialect": "mysql"
	},
	"test": {
		"username": "root",
		"password": null,
		"database": "database_test",
		"host": "127.0.0.1",
		"dialect": "mysql"
	},
	"production": {
		"username": process.env.jaws_username,
		"password": process.env.jaws_password,
		"database": 'hpymvb5de1i66bl4',
		"host": process.env.jaws_host,
		"dialect": "mysql"
	}
}
