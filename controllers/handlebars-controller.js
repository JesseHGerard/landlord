var db = require("../models");
var passport = require("../config/passport");

var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {

	app.get("/", function(req, res) {
		res.render("index");
	});

  // Number Creation
  app.get("/api/number/:id", function(req, res) {

		var buildingNumber = req.params.id;

		db.Building.findOne({
			where: {
				phone: buildingNumber
			}
		})
		.then(data => {

			console.log(data);

			if (data === null) {
				res.json({condition:true, buildingNumber:buildingNumber});
			}
			else {
				res.json({condition:false, buildingNumber:data.id});
			}
		});

    // var findNumber = req.params.id;
    //
		// var food = false;
    //
		// if (food===true) {
	  //   console.log("Look this number up " + findNumber);
		// 	console.log("true!")
	  //     res.render("signup", { title: 'true title', condition: true});
		// 		// res.status("signup").send(false);
		// }
    //
		// else {
		// 		res.render("signup", { title: 'false title', condition: false});
		// 		console.log("false")
		// 		// res.status("signup").send(true);
		// }
    //
    // console.log("Look this number up " + findNumber);
    //   res.send("signup");
      // res.redirect("/api/number/page");
    });


  // Routing to signup
  app.get("/api/search/", function(req,res) {
    res.render("search");
  })

  // app.get("/api/signup/", function(req,res) {
  //   res.render("signup");
  // })

  app.get("/api/signup/:id", function(req,res) {
	 var title = req.params.id;
    // res.render("signup");
		res.render("signup", { title: title, condition: true});
  })

	// Need to do validation on query for the number so no duplicates!!

	app.post("/api/new", function(req, res) {

		db.Tenant.findOne({
			where: {
				phone: req.body.phone
			}
		}).then(data => {
			console.log(data);
			if (data===null) {
				console.log("Book Data:");
				console.log(req.body);
				db.Tenant.create({
					phone: req.body.phone,
					email: req.body.email,
					name: req.body.name,
					apt: req.body.apt,
					password: req.body.password,
					BuildingId: req.body.BuildingId
				});
				res.send("Signup has been successful");
			}
			else {
				res.send("Sorry, but this number has already been registered");
			}
		});




	});


};
