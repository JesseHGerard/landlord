$.get("/tenant/dash/").done(function(data) {

  var labels = $("#info").data("labels");
  var labelsArray = labels.split(",");
  var data = $("#info").data("quantity");
  var dataArray = data.split(",");
  var donutLabels = [];
  var donutData = [];
  const reducer = (accumulator, currentValue) => accumulator + currentValue;

  var names = ["Mike","Matt","Nancy","Adam","Jenny","Nancy","Carl"];
  var uniqueNames = [];
  $.each(labelsArray, function(i, el){
      if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
  });

  for (var a = 0; a < uniqueNames.length; a++) {
    var cat = uniqueNames[a];
    var number = [];

    for (var b = 0; b < labelsArray.length; b++) {
      if (cat === labelsArray[b]) {

        number.push(dataArray[b]);
      }
    }

    var total = number.reduce(reducer)
    donutData.push(total);

  }

  var donut = $("#donutChart");
  var myDonut = new Chart(donut, {
    type: 'doughnut',
    data: {
        labels: uniqueNames,
        datasets: [{
            label: '# of Votes',
            data: donutData,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
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
  var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'line',

      // The data for our dataset
      data: {
          // labels: ["January", "February", "March", "April", "May", "June", "July"],
          labels: labelsArray,
          datasets: [{
              label: "Total Issues",
              backgroundColor: 'rgb(255, 99, 132)',
              borderColor: 'rgb(255, 99, 132)',
              // data: [0, 10, 5, 2, 20, 30, 45],
              data: dataArray,
          }],
          // {
          //   label: "My Second dataset",
          //   // backgroundColor: 'rgb(255, 99, 132)',
          //   borderColor: 'rgb(255, 99, 132)',
          //   data: [10, 0, 2, 5, 30, 20, 10],
          // }]
      },

      // Configuration options go here
      options: {}
  });
});

// chartjs ///////////////////////
