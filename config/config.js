console.log('read config');


module.exports = {
	"development": {
		"username": 'qdere8omc5g2wmqa',
		"password": 'b2g5o89i3q5ov4w7',
		"database": 'hpymvb5de1i66bl4',
		"host": 'tk3mehkfmmrhjg0b.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
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
