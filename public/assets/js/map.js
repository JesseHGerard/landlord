const mapStyles = [{"elementType":"geometry","stylers":[{"color":"#f5f5f5"}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#f5f5f5"}]},{"featureType":"administrative.land_parcel","elementType":"labels.text.fill","stylers":[{"color":"#bdbdbd"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#eeeeee"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#e5e5e5"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#dadada"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"color":"#e5e5e5"}]},{"featureType":"transit.station","elementType":"geometry","stylers":[{"color":"#eeeeee"}]},{"featureType":"water","stylers":[{"color":"#000000"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#c9c9c9"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#363434"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]}];

let map;
let addressList = [];
let buildingsArray;

const createMarkers = () => {
  for (index in buildingsArray) {
    console.log(`pin ${index}?`);
    if (buildingsArray[index].lat != null && buildingsArray[index].lng != null) {
      console.log(`pin ${index}!`);
      let marker = new google.maps.Marker({
        position: {lat: buildingsArray[index].lat, lng: buildingsArray[index].lng},
        map: map,
        clickable: true,
        title: buildingsArray[index].address,
      });
      google.maps.event.addListener(marker, 'click', () => {
        $('#search-field').val(marker.title);
      });
    };
  };
};


const googleGeolocation = () => {
  $.ajax({
    method: 'POST',
    url: "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyD1DN3tpYpimK7iGgLidaYCqHEo1hrbgwg"
  }).then((location, message) => {
    if (message) console.log(`google geolocation used: ${message}`);
    map.setCenter(location.location);
  });
}

const searchInputAddress = () => {
  let isEstablishedAddress = false;
  for (index in addressList) {
    if (addressList[index] === $('#search-field').val()) {
      isEstablishedAddress = true;
    };
  };
  if (isEstablishedAddress) {
    $('#search-button').css('background-color', '#59FFDC').text('sign up');
  } else {
    if ($('#search-field').val() === '') {
      $('#search-button').css('background-color', 'lightgrey').text('search');
    } else {
      $('#search-button').css('background-color', '#A28DF6').text('add new building');
    }
  }
};



// ____________________________________________________________




$(document).ready(() => {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {lat: 38.897831, lng: -77.036537},
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    styles: mapStyles
  });

  // center map, try first with geolocation web api, else use google geolocate
  navigator.geolocation.getCurrentPosition((location) => {
    console.log(`web geolocation api success`);
    map.setCenter({lat: location.coords.latitude, lng: location.coords.longitude});
  }, (error) => {
    googleGeolocation()
  });

  // get building list
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
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({address: inputAddress}, function(res, status) {
        if (inputAddress === res[0].formatted_address) {
          $('#search-button').css('border-color', 'green').css('color', 'green');
        } else {
          let newMarker = new google.maps.Marker({
            position: res[0].geometry.location,
            map: map,
            clickable: true,
          });
          map.setCenter(res[0].geometry.location);
          map.zoom = 8
          $('#search-field').val(res[0].formatted_address);
        };
      });

    } else if ($('#search-button').text() === 'sign up') {
      $.ajax({
        method: ''
      })
    }
  });


});
