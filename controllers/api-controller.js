var db = require("../models");
var passport = require("../config/passport");

module.exports = function(app) {
	
	app.post("/api/login", passport.authenticate("local", {failureFlash: true}), (req, res) => {
		res.redirect("/dashboard"); // To-do: change this to reflect actual urls
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
					if (data.length > 0) {
						db.Tenant.update(tenant, {where: {phone: req.body.phone}}).then(() => {res.json(false);}).catch(errorHandler);
					} else {
						db.Tenant.create(tenant).then(() => {res.json(true);}).catch(errorHandler);
					}
				}).catch(errorHandler);
			} else {
				db.Tenant.create(tenant).then(() => {res.json(true);}).catch(errorHandler);
			}
		} else if (req.body.userType === 'landlord') {
			var landlord = {userType: 'landlord'};
			if (req.body.phone) landlord.phone = req.body.phone;
			if (req.body.email) landlord.email = req.body.email;
			if (req.body.name) landlord.name = req.body.name;
			if (req.body.password) landlord.password = req.body.password;
			if (req.body.BuildingId) landlord.BuildingId = req.body.BuildingId;
			
			db.Landlord.create({
				phone: req.body.phone,
				email: req.body.email,
				name: req.body.name,
				password: req.body.password,
				userType: "landlord",
				BuildingId: req.body.BuildingId
			}).then(() => {res.redirect(307, "/api/login");}).catch(errorHandler);
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
	
	
	/* boilerplate routing shell
	app.<fn>("<route>", (req, res) => {
		
	});
	*/
	
};