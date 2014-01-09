$(function() {
  var socket = io.connect('http://localhost');
  //socket.heartbeatTimeout = 60000*15;
  socket.emit('join graph');

  socket.on('return graph points', function(data) {
    var xdata = [], ydata = [];
    var length = data.data.length;
    
    var x_sum = 0;
    var y_sum = 0;

    for(var i = 0; i < length; i++) {
      xdata.push(data.data[i].weatherScore);
      x_sum = x_sum + data.data[i].weatherScore;
      ydata.push(data.data[i].sentimentPolarity);
      y_sum = y_sum + data.data[i].sentimentPolarity;
    }

    x_avg = x_sum / length;
    y_avg = y_sum / length;       

    x_diff_sum = 0;
    y_diff_sum = 0;

    for(var i = 0; i < length; i++) {
      x_diff_sum = x_diff_sum + Math.pow((data.data[i].weatherScore - x_avg),2);
      y_diff_sum = y_diff_sum + Math.pow((data.data[i].sentimentPolarity - y_avg),2);
    }

    x_stdev = Math.sqrt(x_diff_sum / (length - 1));
    y_stdev = Math.sqrt(y_diff_sum / (length - 1));


    corr_sum = 0;
    for(var i = 0; i < length; i++) {
      x_corr = (data.data[i].weatherScore - x_avg) / x_stdev;
      y_corr = (data.data[i].sentimentPolarity - y_avg) / y_stdev;
      corr_sum = corr_sum + x_corr*y_corr;
    }

    r = corr_sum / (length - 1);

    console.log('Pearson correlation coefficient is ' + r);

    console.log(xdata);
    console.log(ydata);

    

    plotPoints(xdata, ydata);
  });

  function plotPoints(xdata, ydata) {
    // data that you want to plot, I've used separate arrays for x and y values
    //var xdata = [5, 10, 15, 20],
    //    ydata = [3, 17, 4, 6];

    // size and margins for the chart
    var margin = {top: 20, right: 15, bottom: 60, left: 60}
      , width = 960 - margin.left - margin.right
      , height = 500 - margin.top - margin.bottom;

    // x and y scales, I've used linear here but there are other options
    // the scales translate data values to pixel values for you
    var x = d3.scale.linear()
              .domain([0, d3.max(xdata)])  // the range of the values to plot
              .range([ 0, width ]);        // the pixel range of the x-axis

    var y = d3.scale.linear()
              .domain([0, d3.max(ydata)])
              .range([ height, 0 ]);

    // the chart object, includes all margins
    var chart = d3.select('body')
    .append('svg:svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .attr('class', 'chart')

    // the main object where the chart and axis will be drawn
    var main = chart.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'main')   

    // draw the x axis
    var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

    main.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .attr('class', 'main axis date')
    .call(xAxis);

    // draw the y axis
    var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

    main.append('g')
    .attr('transform', 'translate(0,0)')
    .attr('class', 'main axis date')
    .call(yAxis);

    // draw the graph object
    var g = main.append("svg:g"); 

    g.selectAll("scatter-dots")
      .data(ydata)  // using the values in the ydata array
      .enter().append("svg:circle")  // create a new circle for each value
          .attr("cy", function (d) { return y(d); } ) // translate y value to a pixel
          .attr("cx", function (d,i) { return x(xdata[i]); } ) // translate x value
          .attr("r", 1) // radius of circle
          .style("opacity", 0.6); // opacity of circle
  }
});