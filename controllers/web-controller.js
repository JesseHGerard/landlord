var db = require("../models");
var passport = require("../config/passport");
var moment = require("moment");

var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {

  app.get("/", function(req, res) {
	//if (req.user && req.user.userType === 'tenant') return res.redirect("/tenant/dash");
	//if (req.user && req.user.userType === 'landlord') return res.redirect("/landlord/dash");
	if (req.user && (req.user.userType === 'tenant' || req.user.userType === 'landlord')) {
		/*db.Issue.findAll({
			where: {
				BuildingId: req.user.BuildingId
			},
			include: [db.Tenant, db.Building],
			order: [['createdAt', 'DESC']],
		}).then(issues => {
			console.log(issues);
			//res.render("dashboard", {user: req.user, issues: issues});
		});*/
		res.render("dashboard", {user: req.user});
	} else res.render("index");
  });

  app.get("/account-update/:created", function(req, res) {
    res.render("account-update", {created: (req.params.created === 'true')});
  });

  // should probably be in api-controller, but I guess it's fine here because it's so specialized
  app.get('/autocomplete', (req, res) => {
    db.Building.findAll({
      attributes: ['address', 'lat', 'lng', 'id']
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

  app.get("/signup/:address", function(req, res) {

    db.Building.findOne({where: {address: req.params.address}})
      .then(data => {
        console.log(data);
        res.render("signup", {
          title: data.dataValues.id,
          condition: true,
          address: data.dataValues.address
        });
      });
  });

  app.get("/phone-signup/:tenantUuid", (req, res) => {
    db.Tenant.findOne({
      where: {uuid: req.params.tenantUuid},
      include: [db.Building]
    }).then(data => {
      res.render('phone-signup', {
        address: data.Building.dataValues.address,
        phone: data.dataValues.phone,
        apt: data.dataValues.apt,
        name: data.dataValues.name
      });
    });
  });

  app.get("/building/", function(req, res) {
    res.render("building");
  })

  app.get("/signin", (req, res) => {
	if (req.user) {
      res.redirect("/");
    } else {
      res.render("signin");
    }
  });


  app.get("/dashboard", isAuthenticated, (req, res) => {

    var id = req.user.BuildingId;

    function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
    }

    db.Issue.findAll({
      attributes: ['description', 'quantity', 'category', 'class', 'createdAt'],
      where: {
        BuildingId: id
      },
    }).then(data => {

      console.log(data);

      // var labels = [];
      var categories = [];
      // var datasets = [];

      var objectData = {
        labels : [],
        datasets : [],
        // uniqueCategories: [],
        donutData : []
        // datasets2 : []
      };

      function MakeDataset(category, dataArray) {
        this.label = category,
        // this.backgroundColor = getRandomColor(),
        this.borderColor = getRandomColor(),
        this.data = dataArray
      }

      function MakeDatasetDonut(uniqueCategories, donutData, colorArray) {
        this.labels = uniqueCategories,
        this.datasets = [{
          label: 'Breakdown of Issues',
          data: donutData,
          backgroundColor: colorArray,
          borderColor: colorArray,
          borderWidth: 1
        }]
      }

      function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

      function createLabels(data) {
        for (var i = 0; i < data.length; i++) {
          var date = data[i].createdAt;
          var category = data[i].category;
          objectData.labels.push(date);
          categories.push(category);
        }
        console.log(categories);
        var uniqueList = categories.filter(onlyUnique);
        // objectData.uniqueCategories = uniqueList;
        createData(uniqueList,data);
      }

      function createData(uniqueList, data) {

        const reducer = (accumulator, currentValue) => accumulator + currentValue;

        var donutData = [];
        var colorArray = [];

        for (var i = 0; i < uniqueList.length; i++) {
          var category = uniqueList[i]

          var dataArray = [];


          for (var a = 0; a < data.length; a++) {

            if (category === data[a].category) {
              dataArray.push(data[a].quantity)
            }
            else {
              dataArray.push(0);
            }
          }

          console.log(dataArray);
          var total = dataArray.reduce(reducer);
          // objectData.donutData.push(total);
          donutData.push(total);
          var dataset = new MakeDataset(category, dataArray);
          objectData.datasets.push(dataset);
          // var color = getRandomColor();
          // console.log("pushed" + color);
          colorArray.push(dataset.borderColor);

        }

        // console.log(RGBarray);

        var donutset = new MakeDatasetDonut(uniqueList, donutData, colorArray);
        objectData.donutData.push(donutset);
        // var donutset = new MakeDataset(uniqueList, objectData.donutData);
        // objectData.datasets2.push(donutset)

        res.json(objectData);
      }

      createLabels(data);



      // res.render("tenant-dash", {quantity:information.data, information:information.labels, object:data});
    })
  });

  app.get("/userData", isAuthenticated, (req, res) => {
	res.json(req.user);

  });
  
  app.get("/signup/landlord/form/", (req, res) => {
    res.render("landlordsignup");
  })
  
  app.get("/signup/landlord/form/:address", (req, res) => {
	var obj = {};
	if (req.params.address) obj.address = req.params.address;
    res.render("landlordsignup", obj);
  })
  
  // too specific for api-controller
  app.post("/api/issue/mark-noted/:id", (req, res) => {
    if (req.params.id) {
	  db.Issue.update({noted: true}, {where: {id: req.params.id}}).then(() => {
		res.status(200).end();
	  }).catch(() => {
	    req.status(404).end();
	  });
	
    } else {
	  req.status(404).end();
    }
  });

};
