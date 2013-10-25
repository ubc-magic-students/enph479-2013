package ca.ubc.magic.enph479;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;

import ca.ubc.magic.enph479.DataManipulationProcessor.web_type;
import ca.ubc.magic.enph479.DataManipulationProcessor.wot_type;
import ca.ubc.magic.enph479.builder.TweetInstance;
import ca.ubc.magic.enph479.builder.TwitterObject;
import ca.ubc.magic.enph479.builder.WeatherObject;

/**
 * WoTDataFetcher is a controlling manager that calls DataManipulationProcessor to gets data from WoTkit
 * User directly call functions in the class
 * @author richardlee@hotmail.ca
 *
 */
public class WoTDataFetcher {

	private DataManipulationProcessor dmp = null;
	private DB_Handler dbh = null;
	private int fetch_interval = 0; //in seconds
	private String ref_datetime = null; //reference time in system for fetching
	
	public HashMap<Integer, TwitterObject> getAllTweetsData() throws Exception {
		return dmp.gettweets_all();
	}

	public boolean prepareForFetching(int _fetch_interval, String _start_time) throws Exception  {
		dmp = new DataManipulationProcessor();
		this.fetch_interval = _fetch_interval;
		this.ref_datetime = _start_time;
		
		dbh = new DB_Handler();
		if(dbh.prepareDB()) {
			//retrieve existing tweet data from DB before fetching any new data
			ArrayList<TwitterObject> ltweets = dbh.retrieveDBTweet();
			dmp.addToTweets_all(ltweets);
			return true;
		}
		else {
			System.err.println("Error initializing connecting to database!");
			return false;
		}
	}
	
	public void prepareForFetchingLess() throws Exception  {
		dmp = new DataManipulationProcessor();
	}
	
	public void fetchDataExample() throws Exception {
		String start_time = dmp.toEpochTime("2013 Sep 29 23:11:04 UTC");
		String end_time = dmp.toEpochTime("2013 Sep 29 23:11:06 UTC");
		dmp.getJsonFromWoT(wot_type.twitter, start_time, end_time);
		dmp.toListFromJsonParser(wot_type.twitter);
	}
	
	public ArrayList<TweetInstance> fetchData() throws Exception {
		//calculate start time and end time from ref_datetime
		Date date_start_time = new Date(ref_datetime);
		Date date_end_time = new Date(ref_datetime);
		//set start time fetch interval earlier
		date_start_time.setTime(date_start_time.getTime() - fetch_interval * 1000);
		//format data to string with UTC
		DateFormat date_format = new SimpleDateFormat("yyyy MMM dd HH:mm:ss");
		String start_time = date_format.format(date_start_time);
		String end_time = date_format.format(date_end_time);
		start_time += " UTC";
		end_time += " UTC";
		//update ref_date
		Date date_ref_time = new Date(ref_datetime);
		date_ref_time.setTime(date_ref_time.getTime() + fetch_interval * 1000);
		//check if start time is greater than current time
		//if it is, set current time to start time
		Date date_current_time = new Date();
		if(date_ref_time.after(date_current_time))
			date_ref_time = date_current_time;
		String ref_time = date_format.format(date_ref_time);
		ref_datetime = ref_time;
		//get epoch time
		String epoch_start_time = dmp.toEpochTime(start_time);
		String epoch_end_time = dmp.toEpochTime(end_time);
		System.out.println("Fetching data @ " + ref_datetime);
		//retrieve from WoT
		dmp.getJsonFromWoT(wot_type.twitter, epoch_start_time, epoch_end_time);
		dmp.toListFromJsonParser(wot_type.twitter);
		//remove duplicates
		dmp.removeDuplicates(wot_type.twitter);
		//convert twitterObject to TweetInstance for clustering
		ArrayList<TweetInstance> linstance = dmp.toWekaInstanceFromTwitterObj();
		//update current all list
		dmp.updateAllList(wot_type.twitter);
		//write to DB
		dbh.writeToDBTweet(dmp.gettweets_incoming());
		
		return linstance;
	}
	
	public WeatherObject getWeatherFromLatLng(double _lat, double _lng) throws Exception {
		//retrive weather json from web
		dmp.getJsonFromWeb(web_type.weather, _lat, _lng);
		WeatherObject weather_condition = dmp.toWeatherFromJsonParser(web_type.weather);
		//System.out.println("Weather data @ cluster centre: " + weather_condition.printInfo());
		return weather_condition;
	}
	
	
	
}
