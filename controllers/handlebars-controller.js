var db = require("../models");
var passport = require("../config/passport");

module.exports = function(app) {

  app.get("/", function(req, res) {
      res.render("index");
    });

};
