var db = require("../models");
var passport = require("../config/passport");

var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {

  app.get("/", function(req, res) {
	//if (req.user && req.user.userType === 'tenant') return res.redirect("/tenant/dash");
	//if (req.user && req.user.userType === 'landlord') return res.redirect("/landlord/dash");
	if (req.user && req.user.userType === 'tenant') {
		db.Issue.findAll({
			where: {
				BuildingId: req.user.BuildingId
			},
			order: [['createdAt', 'DESC']],
		}).then(issues => {
			res.render("dashboard", {user: req.user, issues: issues});
		});
	} else res.render("index");
  });

  app.get("/account-update/:created", function(req, res) {
    res.render("account-update", {created: (req.params.created === 'true')});
  });

  // should probably be in api-controller, but I guess it's fine here because it's so specialized
  app.get('/autocomplete', (req, res) => {
    db.Building.findAll({
      attributes: ['address']
    }).then(data => res.json(data));
  });

  app.get("/options/:id/:bool/:building?", function(req,res) {
    var addressChange = req.params.id;
    var bool = req.params.bool;
    var buildingId = req.params.building;

    if (bool==="update") {
        res.render("options", {title:"We found you!", condition:true, address:addressChange, building:buildingId});
    } else {
        res.render("options", {title:"We couldn't find you!", condition:false, address:addressChange});
    }
    // console.log(req.params.id);
    // res.render("options", {title:"hello", condition:true});
  });

  // should probably be in api-controller, but I guess it's fine here because it's so specialized
  app.post("/yesno", function(req, res) {
    console.log(req.body.address);

    var addressGiven = req.body.address;

    db.Building.findOne({
      where: {
        address: addressGiven
      }
    }).then(data => {
      console.log(data);

      if (data === null) { // Record doesn't exist
		// testing
		// res.render("options", {title:"rendertest", condition:true});

        res.json({
          condition: false,
          address: addressGiven
        });
      } else { // Record exists
        res.json({
          condition:true,
          address: addressGiven,
          buildingId: data.id
        });
      }
    })
    // res.render("yesno");
  });

  app.get("/signup-b/:id", function(req, res) {
    var address = req.params.id;
    res.render("signup", {
      condition: false,
      address: address
    });
  });

  app.get("/number/:id", function(req, res) {
    // var findNumber = req.params.id;
    //
    // var food = false;
    //
    // if (food===true) {
    //   console.log("Look this number up " + findNumber);
    // 	console.log("true!")
    //     res.render("signup", { title: 'true title', condition: true});
    // 		// res.status("signup").send(false);
    // } else {
    // 		res.render("signup", { title: 'false title', condition: false});
    // 		console.log("false")
    // 		// res.status("signup").send(true);
    // }
    //
    // console.log("Look this number up " + findNumber);
    //   res.send("signup");
    // res.redirect("/number/page");
	res.status(404).end();
  });

  app.get("/search/", function(req, res) {
    res.render("search");
  })

  app.get("/signup/:id/:address", function(req, res) {
    var title = req.params.id;
    var address = req.params.address;
    // res.render("signup");
    res.render("signup", {
      title: title,
      condition: true,
      address: address
    });
  })

  app.get("/building/", function(req, res) {
    res.render("building");
  })

  app.get("/tenant/dash/", isAuthenticated, function(req,res) {
    var id = req.user.BuildingId;
    var information = {
      labels : [],
      data : []
    };

    db.Issue.findAll({
      where: {
        BuildingId: id
      },
    }).then(data => {
      // var information = {information:data};
      if (data.length > 0) console.log(data[0].description);
      if (data.length > 0) console.log(data[0].createdAt);

      for (var i = 0; i < data.length; i++) {
        var date = data[i].createdAt.toString().substring(4,9);
        var time = data[i].createdAt.toString().substring(16,21);
        var description = data[i].description+" "+date+" : "+time;
        var quantity = data[i].quantity;
        information.labels.push(description);
        information.data.push(quantity);
        console.log(information.labels[i]);
        console.log(information.data[i]);
      }

      res.render("tenant-dash", {quantity:information.data, information:information.labels, object:data});
      // res.render("tenant-dash", information);
    });
  });

  app.get("/signin", (req, res) => {
	if (req.user) {
      res.redirect("/");
    } else {
      res.render("signin");
    }
  });

  app.get("/dashboard", isAuthenticated, (req, res) => {
	res.json(req.user);
  });

  app.get("/signup/landlord", (req,res) => {
    res.render("landlordsignup")
  })

};
