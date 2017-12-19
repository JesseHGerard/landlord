var db = require("../models");
var passport = require("../config/passport");

var moment = require('moment');

module.exports = function(app) {


	app.put('/api/phone-signup', (req, res) => {
		db.Tenant.update({
				name: req.body.name,
				apt: req.body.apt,
				password: req.body.password,
				email: req.body.email
			},
			{where: {phone: req.body.phone}})
		.then(data => res.end());
	});


	app.post("/api/login", passport.authenticate("local"), (req, res) => {
		res.json("/"); // To-do: change this to reflect actual urls
	});

	app.post("/api/tenant", (req, res) => {
		//console.log(req.body);
		var errorHandler = function(err) {
			console.log(err);
			res.json(err);
		};

		if (req.body.userType === 'tenant') {
			var tenant = {userType: 'tenant'};
			if (req.body.phone) tenant.phone = req.body.phone;
			if (req.body.email) tenant.email = req.body.email;
			if (req.body.name) tenant.name = req.body.name;
			if (req.body.apt) tenant.apt = req.body.apt;
			if (req.body.password) tenant.password = req.body.password;
			if (req.body.BuildingId) tenant.BuildingId = req.body.BuildingId;

			if (req.body.phone) {
				db.Tenant.findAll({where: {phone: req.body.phone}}).then(data => {
					if (data && data.length > 0) {
						db.Tenant.update(tenant, {where: {phone: req.body.phone}}).then(() => {res.json(false);}).catch(errorHandler);
					} else {
						db.Tenant.create(tenant).then(() => {res.json(true);}).catch(errorHandler);
					}
				}).catch(errorHandler);
			} else {
				db.Tenant.create(tenant).then(() => {res.json(true);}).catch(errorHandler);
			}
		} else {
			res.status(404).end();
		}
	});

	app.post("/api/landlord", (req, res) => {
		//console.log(req.body);
		var errorHandler = function(err) {
			console.log(err);
			res.json(err);
		};

		if (req.body.userType === 'landlord') {
			var landlord = {userType: 'landlord'};
			if (req.body.phone) landlord.phone = req.body.phone;
			if (req.body.email) landlord.email = req.body.email;
			if (req.body.name) landlord.name = req.body.name;
			if (req.body.password) landlord.password = req.body.password;
			if (req.body.BuildingId) landlord.BuildingId = req.body.BuildingId;

			if (req.body.phone || req.body.email) {
				var where;
				if (req.body.phone && req.body.email) {
					where = {[db.sequelize.Op.or]: [{phone: req.body.phone}, {email: req.body.email}]};
				} else if (req.body.phone) {
					where = {phone: req.body.phone};
				} else if (req.body.email) {
					where = {email: req.body.email};
				}

				db.Landlord.findAll({where: where}).then(data => {
					if (data && data.length > 0) {
						db.Landlord.update(landlord, {where: where}).then(() => {res.json(false);}).catch(errorHandler);
					} else {
						db.Landlord.create(landlord).then(() => {res.json(true);}).catch(errorHandler);
					}
				}).catch(errorHandler);
			} else {
				db.Landlord.create(landlord).then(() => {res.json(true);}).catch(errorHandler);
			}
		} else {
			res.status(404).end();
		}
	});

	app.get("/api/logout", (req, res) => {
		req.logout();
		res.redirect("/");
	});

	// creates a building and a tenant
	app.post("/api/building-tenant", function(req, res) {
		db.Building.create({
			phone: "holder",
			address: req.body.address
		}).then(data => {
			// necessary?
			// db.Landlord.create({
			//   phone: req.body.landlordphone, email: req.
			db.Tenant.create({
				phone: req.body.phone,
				email: req.body.email,
				name: req.body.name,
				apt: req.body.apt,
				password: req.body.password,
				userType: "tenant",
				BuildingId: data.id
			}).then(() => {
				res.send(true);
			});
		});
	});

	// Creates new building
	app.post("/api/building", (req, res) => {
		if (!req.user) return res.status(401).end(); // 401 means unauthorized

			// db.Building.findOne({
			// 	where: {
			// 		phone: req.body.address
			// 	}
			// }).then(data => {
			// 	if (data===null) {
			// 	}
			// });

			db.Building.create(req.body).then(dbResponse => {
			res.json(dbResponse); // To-do: change this based on the needs of the website
		}).catch(err => {
			console.log(err);
			res.json(err);
		});
	});

	app.get("/api/buildings", (req, res) => {
		var include = req.user ? [db.Tenant, db.Landlord, db.Issue] : [db.Landlord];
		db.Building.findAll({include: include}).then(data => {
			res.json(data);
		}).catch(err => {
			console.log(err);
			res.json(err);
		});
	});

	app.get("/api/building/", (req, res) => {
		if (!req.user) return res.status(401).end(); // 401 means unauthorized

		var include = [db.Tenant, db.Landlord, db.Issue];
		db.Building.findOne({where: {id: req.user.BuildingId}, include: include}).then(data => {
			res.json(data);
		}).catch(err => {
			console.log(err);
			res.json(err);
		});
	});

	app.get("/api/building/:id", (req, res) => {
		var include = req.user ? [db.Tenant, db.Landlord, db.Issue] : [db.Landlord];
		db.Building.findAll({where: {id: req.params.id}, include: include}).then(data => {
			res.json(data);
		}).catch(err => {
			console.log(err);
			res.json(err);
		});
	});

	app.get("/api/building/address/:address", (req, res) => {
		var include = req.user ? [db.Tenant, db.Landlord, db.Issue] : [db.Landlord];
		db.Building.findAll({where: {address: req.params.address}, include: include}).then(data => {
			res.json(data);
		}).catch(err => {
			console.log(err);
			res.json(err);
		});
	});

	app.get("/api/building/phone/:phone", (req, res) => {
		var include = req.user ? [db.Tenant, db.Landlord, db.Issue] : [db.Landlord];
		db.Building.findAll({where: {phone: req.params.phone}, include: include}).then(data => {
			res.json(data);
		}).catch(err => {
			console.log(err);
			res.json(err);
		});
	});

	app.post("/api/issue", (req, res) => {
		if (!req.user) return res.status(401).end(); // 401 means unauthorized

		db.Issue.create(req.body).then(dbResponse => {
			res.json(dbResponse); // To-do: change this based on the needs of the website
		}).catch(err => {
			console.log(err);
			res.json(err);
		});
	});

	app.get("/api/issues", (req, res) => {
		if (!req.user) return res.status(401).end(); // 401 means unauthorized

		db.Issue.findAll({
			where: {
				BuildingId: req.user.BuildingId
			},
			include: [db.Tenant, db.Building],
			order: [['createdAt', 'DESC']],
		}).then(issues => {
			res.json(issues);
		}).catch(err => {
			console.log(err);
			res.json(err);
		});
	});

	app.get("/api/issues/class/:class", (req, res) => {
		if (!req.user) return res.status(401).end(); // 401 means unauthorized

		db.Issue.findAll({
			where: {
				BuildingId: req.user.BuildingId,
				[db.sequelize.Op.and]: {class: (req.params.class === 'null' ? null : req.params.class)},
			},
			include: [db.Tenant, db.Building],
			order: [['createdAt', 'DESC']],
		}).then(issues => {
			res.json(issues);
		}).catch(err => {
			console.log(err);
			res.json(err);
		});
	});

	app.get("/api/issues/category/:category", (req, res) => {
		if (!req.user) return res.status(401).end(); // 401 means unauthorized

		db.Issue.findAll({
			where: {
				BuildingId: req.user.BuildingId,
				[db.sequelize.Op.and]: {category: (req.params.category === 'null' ? null : req.params.category)},
			},
			include: [db.Tenant, db.Building],
			order: [['createdAt', 'DESC']],
		}).then(issues => {
			res.json(issues);
		}).catch(err => {
			console.log(err);
			res.json(err);
		});
	});

	app.get("/api/issues/reporter/:tenantUuid", (req, res) => {
		if (!req.user) return res.status(401).end(); // 401 means unauthorized

		db.Issue.findAll({
			where: {
				BuildingId: req.user.BuildingId,
				[db.sequelize.Op.and]: {TenantUuid: (req.params.tenantUuid === 'null' ? null : req.params.tenantUuid)},
			},
			include: [db.Tenant, db.Building],
			order: [['createdAt', 'DESC']],
		}).then(issues => {
			res.json(issues);
		}).catch(err => {
			console.log(err);
			res.json(err);
		});
	});

	app.get("/api/issues/time/:window", (req, res) => {
		if (!req.user) return res.status(401).end(); // 401 means unauthorized

		var oldest;
		switch(req.params.window) {
		case 'Hour':
			oldest = moment().subtract(1, 'hours').format();
			break;
		case 'Day':
			oldest = moment().subtract(1, 'days').format();
			break;
		case 'Week':
			oldest = moment().subtract(1, 'weeks').format();
			break;
		case 'Month':
			oldest = moment().subtract(1, 'months').format();
			break;
		case 'Year':
			oldest = moment().subtract(1, 'years').format();
			break;
		default:
			oldest = new Date();
			break;
		}

		db.Issue.findAll({
			where: {
				BuildingId: req.user.BuildingId,
				[db.sequelize.Op.and]: {createdAt: {[db.sequelize.Op.gt]: oldest}},
			},
			include: [db.Tenant, db.Building],
			order: [['createdAt', 'DESC']],
		}).then(issues => {
			res.json(issues);
		}).catch(err => {
			console.log(err);
			res.json(err);
		});
	});

	app.get("/api/is-logged-in", (req, res) => {
		res.json(((req.user) ? true : false));
	});

	app.get("/api/register/tenant/:id", function(req, res) {
		var buildingId = req.params.id;

		db.Building.findOne({
			where: {
				id: buildingId
			}
		}).then(data => {
			res.json({
				buildingNumber: data.id,
				address: data.address
			});
		});
	});

	// I guess this is incomplete?
	app.get("/api/register/building/:id", function(req, res) {
		res.json({address: req.params.id});
	});

	// Number Creation
	app.get("/api/number/:id", function(req, res) {
		var buildingNumber = req.params.id;

		db.Building.findOne({
			where: {
				phone: buildingNumber
			}
		}).then(data => {
			console.log(data);

			if (data === null) {
				res.json({
					condition: true,
					buildingNumber: buildingNumber
				});
			} else {
				res.json({
					condition: false,
					buildingNumber: data.id,
					address: data.address
				});
			}
		});
	});

	app.post("/api/building-landlord", function(req, res) {
		db.Building.create({
			phone: "holder",
			address: req.body.address
		}).then(data => {
			// necessary?
			// db.Landlord.create({
			//   phone: req.body.landlordphone, email: req.
			db.Landlord.create({
				phone: req.body.phone,
				email: req.body.email,
				name: req.body.name,
				password: req.body.password,
				userType: "landlord",
				BuildingId: data.id
			}).then(land => {
				console.log(land);
				res.send(true);
			});
		});

	});


	/* boilerplate routing shell
	app.<fn>("<route>", (req, res) => {

	});
	*/

};
