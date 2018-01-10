# SerfBoard

### [Live Website: https://serfboard.herokuapp.com/](https://serfboard.herokuapp.com/)

#### ( or send a text message to (202) 849-9931 for the full experience )
## sms comments aggregated into a dashboard, for a better landlord and tenant relationship.

created by [Jesse Gerard](http://jessegerard.com/), [Sam Cho](https://github.com/samhkcho), [Stuart Lindstrom](https://github.com/the-realest-stu)

#### key libraries and tech <br>
Twilio API <br>
Google Maps API <br>
Google Geocoding API <br>
Node <br>
Express <br>
Handlebars <br>
MySQL <br>
Sequelize <br>
Heroku <br>
NPM <br>
Git / Github <br>
jQuery <br>
Bootstrap <br>
Javascript ES6 <br>

#### about this project

### code
Two interesting parts of this project are the interactive [map](#map) on the front end, and the [SMS controller](#sms-controller) on the back end.
#### map
The index page map and search bar packs complex functionality into a clean and simple interface. The search bar can autocomplete with addresses pulled from the database.
<br><br>
code below is quoted from: serfboard/public/assets/js/map.js
```
// center map, try first with geolocation web api, else use google geolocate
navigator.geolocation.getCurrentPosition((location) => {
  console.log(`web geolocation api success`);
  map.setCenter({lat: location.coords.latitude, lng: location.coords.longitude});
}, (error) => {
  googleGeolocation()
});

// get building list from db
$.ajax({
  method: 'GET',
  url: '/autocomplete'
}).then(addresses => {
  buildingsArray = addresses;
  console.log(buildingsArray);
  // create autocomplete
  for (address in addresses) {addressList.push(addresses[address].address)};
  $( "#search-field" ).autocomplete({source: addressList});

  // create createMarkers
  createMarkers();
});

// update seach button
$('#search-field').bind('input', function() {
  searchInputAddress();
});
$(document).on('click', function() {
  searchInputAddress();
});


// search button behavior
$('#search-button').on('click', function() {
  let inputAddress = $('#search-field').val();

  if ($('#search-button').text() === 'add new building') {

    function getboth(){
    $.ajax({
      method: 'GET',
      url: `/signup-b/${$('#search-field').val()}`
    }).then(res => window.location.replace(`/signup-b/${$('#search-field').val()}`));
    }

    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({address: inputAddress}, function(res, status) {
      if (inputAddress === res[0].formatted_address) {
        //
      } else {
        let newMarker = new google.maps.Marker({
          position: res[0].geometry.location,
          map: map,
          clickable: true,
          icon: './assets.images.marker.svg'
        });
        map.setCenter(res[0].geometry.location);
        map.zoom = 8
        $('#search-field').val(res[0].formatted_address);
        getboth();
      };
    });

  } else if ($('#search-button').text() === 'sign up') {
    $.ajax({
      method: 'GET',
      url: `/signup/${$('#search-field').val()}`
    }).then(res => window.location.replace(`/signup/${$('#search-field').val()}`));
  }
});

```
#### sms controller
Users can create an account via sms. This requires the server to save state info over the course of multiple sms exchanges, updating the database in correct location each time. The controller is able to distinguish which point in the signup process the user is in based on a combination of state and the data that has already been entered in the database. Then it responds with custom links and personalized text.
<br><br>
code is quoted from
serfboard/controllers/sms-controller.js
```
// receive sms from twilio webhook
app.post('/sms', (req, res) => {
  console.log('req', req.body);
  const userFrom = req.body.From;

  // search db for sms sender phone number
  db.Tenant.findOne({
    where: {phone: userFrom}
  })
  .then(data => {
    // if phone number is not in database
    if (data === null && newUserSetUp[userFrom] === undefined) {
      // get building data (address) from To phone number
      db.Building.findOne({phone: req.body.To}).then(building => {
        // create new tenant
        db.Tenant.create({
          phone: userFrom,
          BuildingId: building.id,
          userType: 'tenant'
        }).then(result => {
          // add user to newUserSetUp, and ask name
          newUserSetUp[userFrom] = {phone: userFrom, nameStatus: false};
          console.log(`Phone Number added to Database: newUserSetUp: ${newUserSetUp}`);
          const twiml = new MessagingResponse();
          twiml.message('Thanks for submitting your issue. Please answer 2 quick questions to set up an account:');
          twiml.message('1. What is your first name?');
          res.writeHead(200, {'Content-Type': 'text/xml'});
          res.end(twiml.toString());
        });
      })

    }
    // user is in newUserSetUp
    else if (data !== null && newUserSetUp[userFrom] !== undefined) {
      console.log(`User is in newUserSetup\nnewUserSetup: ${newUserSetUp}`)
      // name is not defined yet
      if (newUserSetUp[userFrom].nameStatus === false) {
        newUserSetUp[userFrom].name = req.body.Body;
        // add name to database
        db.Tenant.update(
          {name: req.body.Body},
          {where: {phone: data.phone}}
        ).then(result => {
          newUserSetUp[userFrom].nameStatus = true;
          newUserSetUp[userFrom].aptStatus = false;
          // send appartment number request
          const twiml = new MessagingResponse();
          twiml.message(`Thanks ${req.body.Body} \n2. What is your apparment number?`);
          res.writeHead(200, {'Content-Type': 'text/xml'});
          res.end(twiml.toString());
        });
      }
      // appartment is not defined
      else if (newUserSetUp[userFrom].aptStatus === false) {
        newUserSetUp[userFrom].apt = req.body.Body;
        // add apt to database
        db.Tenant.update(
          {apt: req.body.Body},
          {where: {phone: data.phone}}
        ).then(result => {
          delete newUserSetUp[userFrom];
          // send setup success sms
          const twiml = new MessagingResponse();
          twiml.message(`Setup complete! You can now text all your building issues to this number. To make changes to your account, please visit ${process.env.siteUrl}/phone-signup/${data.uuid}`);
          res.writeHead(200, {'Content-Type': 'text/xml'});
          res.end(twiml.toString());
        });
      } else {
        // error message
        const twiml = new MessagingResponse();
        twiml.message(`There was an error setting up your account. Please go to ${process.env.siteUrl} to finish setup.`);
        res.writeHead(200, {'Content-Type': 'text/xml'});
        res.end(twiml.toString());
      };
    }
    // if user is in database and is not in newUserSetUp

    else if (data !== null && newUserSetUp[userFrom] === undefined) {
      // process issue
      let description = req.body.Body.trim();
      let messageArray = description.split(' '), qty, category, issueClass;

      for (item of messageArray) {
        let search = issues.search(item);
        console.log(`search: ${JSON.stringify(search)}`);
        if (search) {
          category = search.category;
          issueClass = search.class;
        } else if (parseInt(item)) {
          qty = parseInt(item);
        };
      };
      // add issue to db
      if (!qty) qty = 1;
      if (!category) {
        category = 'message';
        issueClass = 'message';
      };

      db.Issue.create({
        description: description,
        quantity: qty,
        category: category,
        class: issueClass,
        TenantUuid: data.uuid,
        BuildingId: data.BuildingId
      }).then(issueRes => {
        // respond with issue summary
        db.Issue.sum('quantity', {where: {category: category}}).then(sum => {
          let issueCondition;
          if (category === 'message') {
            issueCondition = 'messages';
          } else {
            issueCondition = category;
          };

          const twiml = new MessagingResponse();
          twiml.message(`Thanks for submitting your issue. There have been ${sum} ${issueCondition} reported in the last day`);
          res.writeHead(200, {'Content-Type': 'text/xml'});
          res.end(twiml.toString());
        });

      });
    };

  }).catch(error => console.log(error));
```
