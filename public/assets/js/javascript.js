$(document).ready(function() {

    // Opening functions - yes or no

    $("#yes").on("click", function(event) {
      $.get("/api/search/").done(function(data) {
        window.location.replace("/api/search/");
      });
    });

    $("#no").on("click", function(event) {
      $.get("/api/signup/").done(function(data) {
        window.location.replace("/api/signup/");
      });
    });

    $("#searchNumber").on("click", function(event) {
      //event.preventDefault();
      var id = $("#numberInput").val().trim();

      $.get("/api/number/"+id).done(function(data) {
        window.location.replace("/api/number/");
      });
    });

    $("#newSign").on("click", function(event) {
      event.preventDefault();

      // Creates a newUser object
      var newUser = {
        name: $("#name").val().trim(),
        email: $("#email").val().trim(),
        password: $("#password").val().trim(),
        building: $("#building").val().trim(),
        apartment: $("#apartment").val().trim(),
        number : $("#number").val().trim()
      };

      // Send an AJAX POST-request
      $.post("/api/new", newUser).done(function(data) {
        console.log(data);
      })
    })


});
