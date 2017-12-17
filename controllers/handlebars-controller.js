var db = require("../models");
var passport = require("../config/passport");

var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {

  app.get("/", function(req, res) {
    res.render("index");
  });

  app.get("/options/:id/:bool/:building?", function(req,res) {

    var addressChange = req.params.id;
    var bool = req.params.bool;
    var buildingId = req.params.building;

    if (bool==="update") {
        res.render("options", {title:"We found you!", condition:true, address:addressChange, building:buildingId});
    }

    else {
        res.render("options", {title:"We couldn't find you!", condition:false, address:addressChange});
    }

    // console.log(req.params.id);
    // res.render("options", {title:"hello", condition:true});
    //
    // var addressOptions = req.params.id;

  });


  app.post("/yesno", function(req, res) {
    console.log(req.body.address);

    var addressGiven = req.body.address;

    db.Building.findOne({
      where: {
        address: addressGiven
      }
    })
    .then(data => {
      console.log(data);

      // Record doesn't exist

      if (data === null) {
        res.json({
          condition: false,
          address: addressGiven
        });
      }
      //
      // Test
      // if (data === null) {
      //   res.render("options", {title:"rendertest", condition:true});
      // }


      // Record exists

      else {
        res.json({
          condition:true,
          address: addressGiven,
          buildingId: data.id
        });
      }
    })

    // res.render("yesno");
  });

  // Congratulations you have updated!
  app.get("/api/congratulations/true", function(req, res) {
    // true creates new account
      res.render("congratulations");
  });

  app.get("/api/congratulations/false", function(req, res) {
    // false updates new account
      res.render("congratulations2");
  });

  app.get("/api/register/tenant/:id", function(req,res) {

    var buildingId = req.params.id;

    db.Building.findOne({
      where: {
        id: buildingId
      }
    })
    .then(data => {
      res.json({
        buildingNumber: data.id,
        address: data.address
      });
    });
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
  app.get("/api/search/", function(req, res) {
    res.render("search");
  })

  // app.get("/api/signup/", function(req,res) {
  //   res.render("signup");
  // })

  app.get("/api/signup/:id/:address", function(req, res) {
    var title = req.params.id;
    var address = req.params.address;
    // res.render("signup");
    res.render("signup", {
      title: title,
      condition: true,
      address: address
    });
  })

  app.get("/api/building/", function(req, res) {
    res.render("building");
  })

  // Need to do validation on query for the number so no duplicates!!
  // Creates new Tenant
  app.post("/api/new", function(req, res) {

    db.Tenant.findOne({
      where: {
        phone: req.body.phone
      }
    }).then(data => {
      console.log(data);
      if (data === null) {
        console.log("Book Data:");
        console.log(req.body);
        db.Tenant.create({
          phone: req.body.phone,
          email: req.body.email,
          name: req.body.name,
          apt: req.body.apt,
          password: req.body.password,
          userType: "tenant", 
          BuildingId: req.body.BuildingId
        });
        res.send(true);
      } else {
        db.Tenant.update({
          email: req.body.email,
          name: req.body.name,
          apt: req.body.apt,
          password: req.body.password,
          BuildingId: req.body.BuildingId
        }, {
          where: {
            phone: req.body.phone
          }
        });
        res.send(false);
      }
    });
  });


  // Creates new building
  app.post("/api/newBuilding", function(req, res) {
    console.log("hello");
    // db.Building.findOne({
    // 	where: {
    // 		phone: req.body.address
    // 	}
    // }).then(data => {
    // 	if (data===null) {
    // 	}
    // });
  });


};
