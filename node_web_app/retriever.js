module.exports = function(mysql) {
   /********** DB Access Process ************/
  var connection = mysql.createConnection({
    host : 'localhost',
    port : 3306,
    database: 'ENPH479',
    user : 'root',
    password : ''
  });

  connection.connect(function(err){
    if(err != null) {
      console.log('Error connecting to mysql:' + err+'\n');
    }
  });

  var tweets = [];

  var findData = function(database, startTime, endTime) {
    var query = "SELECT * from ENPH479." + database;
    if (typeof startTime != undefined && typeof endTime != undefined) {
      query = query + " WHERE timestamp BETWEEN '" + startTime + "' AND '" + endTime + "'";
    }
    
    connection.query(query, function(err, rows){
      if(err != null) {
        console.log("Query error:" + err);
      } else {
        console.log('ADDING TO TWEETS...');
        return rows;
      }
    });
  };

  var initializeTweets = function() {
    console.log('INITIALIZING TWEETS...');
    tweets = findData('tweet_data');
    return tweets;
  }

  var checkForNewTweets = function() {
    var date_now = new Date(new Date().getTime() - 60*60*1000);
    var date = new Date(date_now.getTime() - 2*60*1000).toISOString();
    date.now = date_now.toISOString();

    var rows = findData('tweet_data', date, date_now);
    return addToTweets(rows);
  }

  var addToTweets = function(rows) {
    if (tweets.length != 0) {
      var length = tweets.length;
      var curr_id = tweets[length-1].id;

      var new_tweets = [];
      rows.forEach(function(element, index) {
        if (element.id > curr_id) {
          this.push(element);
        }
      }, new_tweets);
      console.log("NEWTWEETS: " + new_tweets);
      tweets = tweets.concat(new_tweets);
      //sendNewTweets(new_tweets);

      curr_id = tweets[tweets.length-1].id;
      console.log("new_id: " + curr_id);

      return new_tweets;
    }
  }

    var getTimeplayData = function() {
      if(!hour)
        hour = 240; // change back to 24 when done
      var date_now = new Date(new Date().getTime() );
      var date = new Date(date_now.getTime() - hour*60*60*1000).toISOString();
      date_now = date_now.toISOString();
      console.log("datenow: " + date_now)
      console.log("date: " + date)
      var that = this;
      require('async').series([
        function(callback) {
          var rows = findData('timeplay_data', date, date_now);
          callback(null, rows)
        },
        function (callback) {
          var rows = findData('tweet_data', date, date_now);
          callback(null, rows);
        }
      ], 
      function(err, results) {
        return results;
      });

    }
    
    return {
      initializeTweet:    initializeTweets,
      checkForNewTweets:  checkForNewTweets,
      getTimeplayData:    getTimeplayData
    }
}

