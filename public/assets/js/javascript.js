$(document).ready(function() {

  $("#registerTenant").on("click", function(event) {
    event.preventDefault();

    var buildingId = $("#registerTenant").data("id");
    console.log(buildingId);

    $.get("/api/register/tenant/"+ buildingId).done(function(data) {
      window.location.assign("/api/signup/" + data.buildingNumber + "/" + data.address);
    });

  });

  $("#registerLocation").on("click", function(event) {
    event.preventDefault();

    var buildingAddress = $("#registerLocation").data("id");
    // console.log(buildingId);

    $.get("/api/register/building/" + buildingAddress).done(function(data) {
      window.location.assign("/api/bothsignup/" + data.address);
    });

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
    $.get("/api/search/").done(function(data) {
      window.location.replace("/api/search/");
    });
  });

  $('.home').on("click", function(event) {
    $.get("/").done(function(data) {
      window.location.replace("/");
    });
  });

  $("#no").on("click", function(event) {
    $.get("/api/building/").done(function(data) {
      window.location.replace("/api/building/");
    });
  });

  $("#searchNumber").on("click", function(event) {
    //event.preventDefault();
    var id = $("#numberInput").val().trim();

    // $.get("/api/number/"+id);

    $.get("/api/number/" + id).done(function(data) {
      console.log(data);

      if (data.condition === true) {
        alert("Please enter a valid number, you entered " + data.buildingNumber);

        // window.location.assign("/api/number/");
      } else {
        window.location.assign("/api/signup/" + data.buildingNumber + "/" + data.address);
      }

      // window.location.assign("/api/number/");
    });
  });

  $("#newSign").on("click", function(event) {
    event.preventDefault();

    var blinker = $("#newSign").attr("blinker")
    // var buildingId = $("#registerTenant").data("id");
    console.log(blinker);

    if (blinker==="on") {

      var newUser = {
        phone: $("#phone").val().trim(),
        email: $("#email").val().trim(),
        name: $("#name").val().trim(),
        apt: $("#apt").val().trim(),
        password: $("#password").val().trim(),
        BuildingId: $("#title").data("id")
      };

      if (newUser.phone === "" || newUser.email === "" || newUser.name === "" || newUser.apt === "" || newUser.apt === "") {
        alert("Please fill in all of the fields");
      } else {
        // Send an AJAX POST-request
        $.post("/api/new", newUser).done(function(data) {
          if (data) {
            alert("Created a new account!");
          } else {
            alert("Updated an account!");
          }
      window.location.assign("/account-update/" + data);
        });
      }
    }

    else {

      var newUser = {
        phone: $("#phone").val().trim(),
        email: $("#email").val().trim(),
        name: $("#name").val().trim(),
        apt: $("#apt").val().trim(),
        password: $("#password").val().trim(),
        address: $("#addressHolder").data("id"),
        landlordphone: $("#landLordPhone").val().trim(),
        landlordemail: $("#landLordEmail").val().trim()
      };

      if (newUser.phone === "" || newUser.email === "" || newUser.name === "" || newUser.apt === "" || newUser.apt === "" || newUser.landlordemail === "" || newUser.landlordphone === "") {
        alert("Please fill in all of the fields");
      } else {

        console.log(newUser.landlordphone);
        // Send an AJAX POST-request
        $.post("/api/newboth", newUser).done(function(data) {
          if (data) {
            alert("Created a new account!");
          } else {
            alert("Updated an account!");
          }
      window.location.assign("/account-update/" + data);
        });
      }

    }

    // Creates a newUser object


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
      $.post("/api/newBuilding", newBuilding).done(function(data) {
        alert(data);
      });
    }
  });


});
