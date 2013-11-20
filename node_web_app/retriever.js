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

  var findData = function(options) {
    var query = "SELECT * from ENPH479." + options.database;
    
    if (options.startTime && options.endTime) {
      query = query + " WHERE timestamp BETWEEN '" + options.startTime + "' AND '" + options.endTime + "'";
    }
    
    connection.query(query, function(err, rows){
      if(err != null) {
        console.log("Query error:" + err);
      } else {
        if (options.callback) {
          if (options.callback2) {
            options.callback(null, rows, options.callback2);
          } else {
            options.callback(null, rows);
          }
        }
      }
    });
  };

  var initializeTweets = function(callback) {
    findData({ database: 'tweet_data', callback: function(err, rows) {
      tweets = rows;
      callback(err, rows);
    }});
  }

  var checkForNewTweets = function(callback) {
    var date_now = new Date(new Date().getTime() - 60*60*1000);
    var date = new Date(date_now.getTime() - 2*60*1000).toISOString();
    date.now = date_now.toISOString();

    findData({ database: 'tweet_data', callback: addToTweets, callback2: callback, startTime: date, endTime: date_now });
  }

  var addToTweets = function(err, rows, callback) {
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

      callback(null, new_tweets);
    }
  }

  var getTimeplayData = function(userCallback, hour) {
    if(!hour)
      hour = 24*7; // change back to 24 when done
    var date_now = new Date(new Date().getTime() );
    var date = new Date(date_now.getTime() - hour*60*60*1000).toISOString();
    date_now = date_now.toISOString();
    console.log("datenow: " + date_now)
    console.log("date: " + date)
    require('async').series([
      function(callback) {
        findData({ database: 'timeplay_data', startTime: date, endTime: date_now, callback: callback });
      },
      function (callback) {
        findData({ database: 'tweet_data', startTime: date, endTime: date_now, callback: callback });
      }
    ], 
    function(err, results) {
      console.log('callback called');
      userCallback(null, results);
    });

  }
  
  return {
    initializeTweets:   initializeTweets,
    checkForNewTweets:  checkForNewTweets,
    getTimeplayData:    getTimeplayData
  }
}

