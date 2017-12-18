var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCM1CXYGhsyp8_8Rpq6sUo0ewr3py-ufw4'
});

googleMapsClient.geocode({
  address: '1507 Park Rd NW Washington DC 20010'
}, function(err, response) {
  if (!err) {
    console.log(JSON.stringify(response.json.results));
  }
});
