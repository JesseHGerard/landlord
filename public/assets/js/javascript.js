$(document).ready(function() {

  // Opening functions - yes or no

  $("#yes").on("click", function(event) {
    $.get("/api/search/").done(function(data) {
      window.location.replace("/api/search/");
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
        window.location.assign("/api/signup/" + data.buildingNumber);
      }

      // window.location.assign("/api/number/");
    });
  });

  $("#newSign").on("click", function(event) {
    event.preventDefault();

    // Creates a newUser object
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
          window.location.assign("/api/congratulations/" + data);
          }
        else {
          alert("Updated a new account!");
          window.location.assign("/api/congratulations/" + data);
        }
      });
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
      $.post("/api/newBuilding", newBuilding).done(function(data) {
        alert(data);
      });
    }
  });


});
