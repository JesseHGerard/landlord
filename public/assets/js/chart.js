  $("#graph-tab").on("click", function(event) {
    event.preventDefault();

$.get("/dashboard").done(function(data) {

  console.log(data);

  console.log(data.donutData.labels);

  var gtx = document.getElementById("donutChart").getContext('2d');
  var myChart = new Chart(gtx, {
      type: 'doughnut',
      data: {
          labels: data.donutData[0].labels,
          datasets: data.donutData[0].datasets
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }
  });




  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: data.labels,
          datasets: data.datasets
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }
  });

});

  });
// chartjs ///////////////////////
