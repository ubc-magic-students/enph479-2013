function TableManager(regions) {
  mediator.installTo(this);

  this.subscribe(EVENTS.INITIALIZE, function() {
    this.initializeDataset();
  });

  this.subscribe(EVENTS.REGION_UPDATE, function(data) {
    this.saveLastUpdated(data);
  });

  this.subscribe(EVENTS.SHOW_REGION_UPDATE, function(regionId) {
    if (regionId == -1) {
      this.showLastUpdated();
    } else {
      this.showLastUpdatedRegion();
    }
  });

  this.subscribe(EVENTS.SHOW_TIMEPLAY, function(time, tableData) {
    this.updatePlayTable(tableData);
  });

  this.subscribe(EVENTS.STOP_TIMEPLAY, function () {
      this.showLastUpdated();
  });
  

  this.dataset = [];
  this.rowHeader = [];
  this.columnHeader = ['Neighbourhood', 'Sentiment', 'Weather', '# of Tweets'];
  this.lastUpdated = [];

  this.initializeRowHeader = function() {
    regions.forEach(function(element) {
      this.rowHeader.push(element.name);
    }, this);
  }

  this.initializeDataset = function() {
    this.initializeRowHeader();

    //this.lastUpdated.push(this.columnHeader);

    this.rowHeader.forEach(function(element) {
      this.lastUpdated.push([element, '-', '-', '-']);
    }, this);
    this.showLastUpdated();
  }

  this.saveLastUpdated = function(data) {
    this.lastUpdated = [];
    //this.lastUpdated.push(this.columnHeader);
  
    this.rowHeader.forEach(function(element, index) {
      this.lastUpdated.push([element, data[index].currentSentimentAverage, data[index].currentWeatherAverage, data[index].tweetCount]);
    }, this);
  }

  this.showLastUpdated = function() {
    console.log('last updated table data rendered');
    this.renderTable(this.lastUpdated, this.columnHeader);
  }

  this.showLastUpdatedRegion = function(regionId) {
    console.log('last updated table data for region rendered: ' + 'regionId ' + regionId);
    this.renderTableForRegion(regionId);
  }

  this.updatePlayTable = function(data) {
    this.dataset = [];
    //this.dataset.push(['Neighbourhood', 'Sentiment', 'Weather']);
  
    this.rowHeader.forEach(function(element, index) {
      this.dataset.push([element, data[index].sentiment, data[index].weather]);
    }, this);
    this.renderTable(this.dataset, ['Neighbourhood', 'Sentiment', 'Weather']);
  }

  this.renderTableForRegion = function(regionId) {
    var regionData = this.lastUpdated[regionId];
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

        for(var i = 1; i < this.columnHeader.length; i++) {
          var num = regionData[i];
          if (i !== 3) {
            num = isNaN(num) ? num : (isInt(num) ? num : num.toFixed(3));
          } 
          tbody.append("tr")
            .selectAll("td")
            .data([this.columnHeader[i], num])
            .enter().append("td")
            .attr("class", function(d, i) {
              return i % 2 ? "c_even": "c_odd";
            })
            .text(function(c) {return c;});
        }

  }

  this.renderTable = function(dataset, columnHeader) {
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
  }

  function isInt(num) {
      return (Math.floor(num) === num) ? true : false;
  }
}