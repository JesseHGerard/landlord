$( function() {

  $.ajax({
    method: 'GET',
    url: '/autocomplete'
  }).then(addresses => {
    let addressList = [];
    for (address in addresses) {
      addressList.push(addresses[address].address);
    };
    console.log(addressList);
    $( "#addressLookUp" ).autocomplete({
      source: addressList
    });
  })
} );
