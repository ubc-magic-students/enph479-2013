function WordCloudManager() {
  mediator.installTo(this);

  this.subscribe(EVENTS.INITIALIZE, function() {
    var words = [{
      text: "Hello",
      size: 50
    }, {
      text: "World",
      size: 25
    }, {
      text: "normally",
      size: 51
    }, {
      text: "words",
      size: 35
    }];
    drawWordCloud(words);
  });

  var drawWordCloud = function(words) {
    d3.layout.cloud().size([300, 300])
        .words(words)
        .padding(5)
        .rotate(function() { return 0; })
        .font("Impact")
        .fontSize(function(d) { return d.size; })
        .on("end", draw)
        .start();
  };

  function draw(words) {
    var fill = d3.scale.category20();
    d3.select("#wordcloud").append("svg")
        .attr("width", 300)
        .attr("height", 300)
      .append("g")
        .attr("transform", "translate(150,150)")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
  }
}