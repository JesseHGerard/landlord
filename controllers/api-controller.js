var db = require("../models");
var passport = require("../config/passport");

module.exports = function(app) {
	
	app.post("/api/login", passport.authenticate("local"), (req, res) => {
		res.json("/dashboard"); // To-do: change this to reflect actual urls
	});
	
	app.post("/api/signup", (req, res) => {
		//console.log(req.body);
		
		var promise = function() {
			res.redirect(307, "/api/login");
		};
		var errorHandler = function(err) {
			console.log(err);
			res.json(err);
		};
		
		if (req.body.userType === 'tenant') {
			db.Tenant.create(req.body).then(promise).catch(errorHandler); // To-do: Handle combinations with existing tenants
		} else if (req.body.userType === 'landlord') {
			db.Landlord.create(req.body).then(promise).catch(errorHandler); // To-do: Handle combinations with existing tenants
		}
	});
	
	app.get("/api/logout", (req, res) => {
		req.logout();
		res.redirect("/");
	});
	
	app.post("/api/building", (req, res) => {
		if (!req.user) return res.status(401).end(); // 401 means unauthorized
		
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
	
	/* boilerplate routing shell
	app.<fn>("<route>", (req, res) => {
		
	});
	*/
	
};