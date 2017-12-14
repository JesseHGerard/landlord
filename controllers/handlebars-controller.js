var db = require("../models");
var passport = require("../config/passport");

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


};
