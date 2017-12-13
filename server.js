var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('./config/passport');
var db = require('./models');

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: "r0ach m0t31", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

require('./controllers/api-controller')(app);
require('./controllers/sms-controller')(app);

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log("Listening on port " + PORT);
	});
});