function GraphManager() {
  mediator.installTo(this);
  var timeplayData;

  this.subscribe(EVENTS.INITIALIZE_TIMEPLAY, function(data) {
    var checkArray = [];
    $.map($("input[type='checkbox']"), function(val, i) {
      checkArray.push($(val).is(':checked'));
    });
    updateRegionGraph(data[0], checkArray);
  });

  this.subscribe(EVENTS.CHANGE_GRAPH_VIEW, function(checkArray) {
    updateRegionGraph(timeplayData, checkArray);
  });

  var updateRegionGraph = function(inputData, checkArray) {
    if (!timeplayData && inputData) {
      timeplayData = inputData;
    }
    var data = [];
    var length;
    if (timeplayData) {
      checkArray.forEach(function(element, index) {
        if (element) {
          data[index] = { sentiment: [], weather: [] };
        }
      });

      timeplayData.forEach(function(element, index) {
        if (checkArray[element.region]) {
          data[element.region].sentiment.push(element.sentiment);
          data[element.region].weather.push(element.weather);
        }
      });
    }
    if (data.length != 0) {
      data.forEach(function(element, index) {
        if (element) {
          length = element.sentiment.length;
        }
      });
      doubleLineGraph(data, length);
    }
  }
}

function doubleLineGraph(data, length) {
    $('div#graph').empty();
// define dimensions of graph
    var m = [80, 80, 80, 80]; // margins
    var w = 800;  // width
    var h = 300; // height

    // X scale will fit all values from data[] within pixels 0-w
    var x = d3.scale.linear().domain([0, length]).range([0, w]);
    // Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
    var y1 = d3.scale.linear().domain([0, 4]).range([h, 0]); // in real world the domain would be dynamically calculated from the data
    var y2 = d3.scale.linear().domain([0, 10]).range([h, 0]);  // in real world the domain would be dynamically calculated from the data
      // automatically determining max range can work something like this
      // var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);

    // create a line function that can convert data[] into x and y points
    var line1 = d3.svg.line()
      // assign the X function to plot our line as we wish
      .x(function(d,i) { 
        // verbose logging to show what's actually being done
        //console.log('Plotting X1 value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
        // return the X coordinate where we want to plot this datapoint
        return x(i); 
      })
      .y(function(d) { 
        // verbose logging to show what's actually being done
        //console.log('Plotting Y1 value for data point: ' + d + ' to be at: ' + y1(d) + " using our y1Scale.");
        // return the Y coordinate where we want to plot this datapoint
        return y1(d); 
      })
      
    var line2 = d3.svg.line()
      .x(function(d,i) { 
        return x(i); 
      })
      .y(function(d) { 
        return y2(d); 
      })

      // Add an SVG element with the desired dimensions and margin.
      var graph = d3.select("#graph").append("svg:svg")
            .attr("width", w + m[1] + m[3])
            .attr("height", h + m[0] + m[2])
          .append("svg:g")
            .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

      // create yAxis
        var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
      // Add the x-axis.
      graph.append("svg:g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + h + ")")
            .call(xAxis);


      // create left yAxis
      var yAxisLeft = d3.svg.axis().scale(y1).ticks(4).orient("left");
      // Add the y-axis to the left
      graph.append("svg:g")
            .attr("class", "y axis axisLeft")
            .attr("transform", "translate(-15,0)")
            .call(yAxisLeft);

        // create right yAxis
        var yAxisRight = d3.svg.axis().scale(y2).ticks(6).orient("right");
        // Add the y-axis to the right
        graph.append("svg:g")
              .attr("class", "y axis axisRight")
              .attr("transform", "translate(" + (w+15) + ",0)")
              .call(yAxisRight);
      

      data.forEach(function(element) {
        if (element) {
          graph.append("svg:path").attr("d", line1(element.sentiment)).attr("class", "data1");
          graph.append("svg:path").attr("d", line2(element.weather)).attr("class", "data2");
        }
      });
}
   