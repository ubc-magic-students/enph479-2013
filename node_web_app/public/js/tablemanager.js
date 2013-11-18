function TableManager(regions) {
  mediator.installTo(this);
  this.registerCallbacks([{ 
      channel:  EVENTS.INITIALIZE,
      fn:       function () {
                  initializeDataset();
                }
    }, {
      channel:  EVENTS.REGION_UPDATE,
      fn:       function(data) {
                  saveLastUpdated(data);
                }
    }, {
      channel:  EVENTS.SHOW_REGION_UPDATE,
      fn:       function(regionId) {
                  if (regionId == -1) {
                    showLastUpdated();
                  } else {
                    showLastUpdatedRegion(regionId);
                  }
                }
    }, {
      channel:  EVENTS.SHOW_TIMEPLAY,
      fn:       function(playbackInstance) {
                  updatePlayTable(playbackInstance.regionData);
                }
    }, {
      channel:  EVENTS.STOP_TIMEPLAY,
      fn:       function() {
                  showLastUpdated();  
                }
  }]);

  var dataset = [];
  var rowHeader = [];
  var columnHeader = ['Neighbourhood', 'Sentiment', 'Weather', '# of Tweets'];
  var lastUpdated = [];
  var checkArray = [];

  var initializeRowHeader = function() {
    regions.forEach(function(element) {
      rowHeader.push(element.name);
    });
  };

  var initializeDataset = function() {
    initializeRowHeader();

    //this.lastUpdated.push(this.columnHeader);

    rowHeader.forEach(function(element) {
      lastUpdated.push([element, '-', '-', '-']);
    });
    showLastUpdated();
  }

  var saveLastUpdated = function(data) {
    lastUpdated = [];
    //this.lastUpdated.push(this.columnHeader);
  
    rowHeader.forEach(function(element, index) {
      lastUpdated.push([element, data[index].currentSentimentAverage, data[index].currentWeatherAverage, data[index].tweetCount]);
    });
  }

  var showLastUpdated = function() {
    console.log('last updated table data rendered');
    renderTable(lastUpdated, columnHeader);
  }

  var showLastUpdatedRegion = function(regionId) {
    console.log('last updated table data for region rendered: ' + 'regionId ' + regionId);
    renderTableForRegion(regionId);
  }

  var updatePlayTable = function(data) {
    dataset = [];
    //this.dataset.push(['Neighbourhood', 'Sentiment', 'Weather']);
  
    rowHeader.forEach(function(element, index) {
      dataset.push([element, data[index].sentiment, data[index].weather]);
    });
    renderTable(dataset, ['Neighbourhood', 'Sentiment', 'Weather']);
  }

  var renderTableForRegion = function(regionId) {
    var regionData = lastUpdated[regionId];
    console.log("Render Table for Region: " + regionData[0]);
    $("#table").empty();
    d3.select("#table")
        .selectAll("h1")
        .data([regionData[0]])
        .enter().append("h1")
        .text(function(c) {return c;});


    var tbody = d3.select("#table")
              .append("table")
              .append("tbody");

        for(var i = 1; i < columnHeader.length; i++) {
          var num = regionData[i];
          if (i !== 3) {
            num = isNaN(num) ? num : (isInt(num) ? num : num.toFixed(3));
          } 
          tbody.append("tr")
            .selectAll("td")
            .data([columnHeader[i], num])
            .enter().append("td")
            .attr("class", function(d, i) {
              return i % 2 ? "c_even": "c_odd";
            })
            .text(function(c) {return c;});
        }
    $("td.c_name").prepend("<input type='checkbox'>");
    $.map($("input[type='checkbox']"), function(val, i) {
      if (checkArray[i]) {
        $(val).prop('checked', true);
      }
    });
    $("input[type='checkbox']").change(function() {
      checkArray = [];
      $.map($("input[type='checkbox']"), function(val, i) {
        checkArray.push($(val).is(':checked'));
      });
      mediator.publish(EVENTS.CHANGE_GRAPH_VIEW, checkArray);
    });

  }

  renderTable = function(dataset, columnHeader) {
    $("#table").empty();
    var table = d3.select("#table")
              .append("table"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

        thead.append("tr")
          .selectAll("th")
          .data(columnHeader)
          .enter().append("th")
          .attr("class", function(d, i) {
            return i % 2 ? "c_even": "c_odd";
          })
          .text(function(c) {return c;});

        tbody.selectAll("tr")
        .data(dataset)
        .enter().append("tr")
        
        .selectAll("td")
        .data(function(d){return d;})
        .enter().append("td")
        .attr("class", function(d, i) {
          if (i === 0)
            return "c_odd c_name";
          return i % 2 ? "c_even": "c_odd";
        })
        .text(function(d){
          return (isNaN(d) ? d : (isInt(d) ? d : d.toFixed(3)));
        });
    $("td.c_name").prepend("<input type='checkbox'>");
    $.map($("input[type='checkbox']"), function(val, i) {
      if (checkArray[i]) {
        $(val).prop('checked', true);
      }
    });
    $("input[type='checkbox']").change(function() {
      checkArray = [];
      $.map($("input[type='checkbox']"), function(val, i) {
        checkArray.push($(val).is(':checked'));
      });
      mediator.publish(EVENTS.CHANGE_GRAPH_VIEW, checkArray);
    });
  }

  function isInt(num) {
      return (Math.floor(num) === num) ? true : false;
  }
}