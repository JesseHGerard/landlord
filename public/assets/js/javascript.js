$(document).ready(function() {
  //
  $("#registerLandLord").on("click", function(event) {
    event.preventDefault();
	
	var adrs = $("#search-field").val().trim();
	
    window.location.replace("/signup/landlord/form/" + adrs);

  });

  $("#newIssue").on("click", function(event) {
    event.preventDefault();

    var newIssue = $("#makeIssue").val().trim();

    // $.post("/api/issue", newIssue).done(function(data) {
    //   window.location.reload();
    // })

  });

  $("#registerTenant").on("click", function(event) {
    event.preventDefault();

    var buildingId = $("#registerTenant").data("id");
    console.log(buildingId);

    $.get("/api/register/tenant/"+ buildingId).done(function(data) {
      window.location.assign("/signup/" + data.buildingNumber + "/" + data.address);
    });

  });

  $("#registerLocation").on("click", function(event) {
    event.preventDefault();

    var buildingAddress = $("#registerLocation").data("id");
    // console.log(buildingId);

    $.get("/api/register/building/" + buildingAddress).done(function(data) {
      window.location.assign("/signup-b/" + data.address);
    });

  });

  $("#signin-form").on('submit', (event) => {
	event.preventDefault();

	var email = $("#email").val().trim();
	var password = $("#password").val().trim();
	var userType = $("#is-landlord").is(":checked") ? 'landlord' : 'tenant';

	if (email && email.length > 0 && password && password.length > 0) {
	  $.post("/api/login", {
		userType: userType,
		email: email,
		password: password,
	  }).done(data => {
		window.location.replace(data);
	  }).fail(err => {
		  console.log(err);
		  if (err.status === 401) alert("Incorrect email or password");
	  });
	}
  });

  // Opening functions - yes or no

  $("#searchAddress").on("click", function(event) {

    var address = {address:$("#addressLookUp").val().trim()};

    if (address.address==="") {
      alert("Please fill in the address");
    }
    else {

      $.post("/yesno", address).done(function(data) {

        // Exists in our database
        if (data.condition === true) {
          alert("We found your location");
          window.location.replace("/options/"+ data.address + "/update/" + data.buildingId);
        }

        // Doesnt exist in our database
        else {
          alert("Please enter a valid address " + data.address);
          window.location.replace("/options/"+ data.address + "/make");
        }

        // window.location.replace("/yesno"+address);
      });

    }

  });

  $("#yes").on("click", function(event) {
    window.location.replace("/search");
  });

  $('.home').on("click", function(event) {
     window.location.replace("/");
  });

  $("#no").on("click", function(event) {
    window.location.replace("/building");
  });

  $("#searchNumber").on("click", function(event) {
    //event.preventDefault();
    var id = $("#numberInput").val().trim();

    $.get("/api/number/" + id).done(function(data) {
      console.log(data);

      if (data.condition === true) {
        alert("Please enter a valid number, you entered " + data.buildingNumber);
        // window.location.assign("/number");
      } else {
        window.location.assign("/signup/" + data.address);
      }
    });
  });

  $("#newSign").on("click", function(event) {
    event.preventDefault();

    var blinker = $("#newSign").attr("blinker")
    // var buildingId = $("#registerTenant").data("id");
    console.log(blinker);

    if (blinker === "on") {
      var newUser = {
        phone: $("#phone").val().trim(),
        email: $("#email").val().trim(),
        name: $("#name").val().trim(),
        apt: $("#apt").val().trim(),
        password: $("#password").val().trim(),
        BuildingId: $("#title").data("id"),
		userType: 'tenant',
      };

      if (newUser.phone === "" || newUser.email === "" || newUser.name === "" || newUser.apt === "" || newUser.apt === "") {
        alert("Please fill in all of the fields");
      } else {
        // Send an AJAX POST-request
        $.post("/api/tenant", newUser).done(function(data) {
          if (data && (data === true || data === false)) {
            alert((data ? "Created a new account" : "Updated your account"));
			window.location.assign("/account-update/" + data);
          } else {
			console.log(data);
		  }
        });
      }
    } else {
      var newUser = {
        phone: $("#phone").val().trim(),
        email: $("#email").val().trim(),
        name: $("#name").val().trim(),
        apt: $("#apt").val().trim(),
        password: $("#password").val().trim(),
		userType: 'tenant',
        address: $("#addressHolder").data("id"),
        landlordphone: $("#landLordPhone").val().trim(),
        landlordemail: $("#landLordEmail").val().trim(),
      };

      if (newUser.phone === "" || newUser.email === "" || newUser.name === "" || newUser.apt === "" || newUser.apt === "" || newUser.landlordemail === "" || newUser.landlordphone === "") {
        alert("Please fill in all of the fields");
      } else {
        console.log(newUser.landlordphone);
        // Send an AJAX POST-request
        $.post("/api/building-tenant", newUser).done(function(data) {
          if (data) {
            alert("Created a new account!");
			window.location.assign("/account-update/true");
          }
        });
      }
    }
  });


  $("#newBuilding").on("click", function(event) {
    event.preventDefault();

    var newBuilding = {
      address: $("#address").val().trim(),
      phone: $("#phone").val().trim()
    };

    if (newBuilding.address === "" || newBuilding.phone === "") {
      alert("Please fill in all the fields");
    } else {
      console.log("hello");
      $.post("/api/building", newBuilding).done(function(data) {
        alert(data);
      });
    }
  });


  $("#newLandLord").on("click", function(event) {
    event.preventDefault();

    var newLandlord = {
      name: $("#name").val().trim(),
      email: $("#email").val().trim(),
      password: $("#password").val().trim(),
      phone: $("#phone").val().trim(),
      address: $("#addressLookUp").val().trim()
    };

    $.post("/api/building-landlord", newLandlord).done(function(data) {
      if (data) {
        alert("Created a new account!");
        window.location.assign("/account-update/true");
      }
    });


  })


});
