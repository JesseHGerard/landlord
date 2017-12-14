var db = require("../models");
var passport = require("../config/passport");

var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {

	app.get("/", function(req, res) {
		res.render("index");
	});

  // Number Creation
  app.get("/api/number/:id", function(req, res) {

    var findNumber = req.params.id;

    console.log("Look this number up " + findNumber);
      res.send("signup");
      // res.redirect("/api/number/page");
    });

  // Routing to signup
  app.get("/api/search/", function(req,res) {
    res.render("search");
  })

  app.get("/api/signup/", function(req,res) {
    res.render("signup");
  })

  app.get("/api/number/", function(req,res) {
    res.render("signup");
  })

	app.post("/api/new", function(req, res) {
		console.log("Book Data:");
		console.log(req.body);
		db.Tenant.create({
			phone: req.body.number,
			email: req.body.email,
			name: req.body.name,
			apt: req.body.apartment,
			password: req.body.password
		});
		res.send("Signup has been successful");
	});


};
