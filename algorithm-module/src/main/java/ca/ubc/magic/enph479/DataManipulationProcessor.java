package ca.ubc.magic.enph479;

import java.net.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.io.*;

import ca.ubc.magic.enph479.builder.RegionObject;
import ca.ubc.magic.enph479.builder.TwitterObject;
import ca.ubc.magic.enph479.builder.RegionObject.regionX;
import ca.ubc.magic.enph479.builder.WeatherObject;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;


/**
 * DataManipulationProcessor is the low level algorithm that actually process raw data processed from WoTkit
 * User has no access to this class
 * @author richardlee@hotmail.ca
 *
 */
public class DataManipulationProcessor {
	
	public enum wot_type {twitter, none};
	public enum web_type {weather, none};
	private String json_string_twitter = null;
	private String json_string_weather = null;
	private ArrayList<TwitterObject> ltweets_incoming = new ArrayList<TwitterObject>();
	private HashMap<Integer, TwitterObject> ltweets_all = new HashMap<Integer, TwitterObject>(); //stores all of the tweets
	private WeatherObject weather_info = new WeatherObject();
	private RegionObject region_info = new RegionObject();
	
	private boolean is_debug = true;
	/*private String[] wot_url_tweet = new String[] {"http://wotkit.sensetecnic.com/api/sensors/2013enph479.tweets-in-vancouver/data?start=",
													"&end="};*/ //outdated wotkit database
	private String[] wot_url_tweet = new String[] {"http://bennu.magic.ubc.ca/wotkit/api/sensors/2013enph479.tweets-in-vancouver2/data?start=",
													"&end="};
	private String[] web_url_weather = new String[] {"http://api.openweathermap.org/data/2.5/weather?lat=",
													"&lon="};
	
	
	public String toEpochTime(String _date) {
		
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyy MMM dd HH:mm:ss zzz");
	    Date date = null;
		try {
			date = sdf.parse(_date);
		} catch (ParseException e) {
			e.printStackTrace();
		}
	    long epoch = date.getTime();
	    
	    return String.valueOf(epoch);
	}
	
	public void getJsonFromWoT(wot_type _type, String _startTime, String _endTime){
		
		String url_1 = null, url_2 = null;
		
		if(_type == wot_type.twitter) {
			url_1 = wot_url_tweet[0];
			url_2 = wot_url_tweet[1];
			
			try {
				URL wot_url = new URL(url_1 + _startTime + url_2 + _endTime);
		        URLConnection con = wot_url.openConnection();
		        BufferedReader breader = new BufferedReader(
		                                new InputStreamReader(
		                                		con.getInputStream()));
		        json_string_twitter = breader.readLine();
		        //if(is_debug)
		        //	System.out.println(json_string_twitter);
		        breader.close();
			}
			catch(Exception ex) {
				json_string_twitter = "";
				if(is_debug)
	            	System.err.println("WoT Kit API not responding to HTTP request: " + ex.getMessage());
			}
		}
	}
	
	public void getJsonFromWeb(web_type _type, double _lat, double _lng){
		
		String url_1 = null, url_2 = null;
		
		if(_type == web_type.weather) {
			url_1 = web_url_weather[0];
			url_2 = web_url_weather[1];
			
			try {
				URL web_url = new URL(url_1 + _lat + url_2 + _lng);
		        URLConnection con = web_url.openConnection();
		        BufferedReader breader = new BufferedReader(
		                                new InputStreamReader(
		                                		con.getInputStream()));
		        json_string_weather = breader.readLine();
		        //if(is_debug)
		        //	System.out.println(json_string_weather);
		        breader.close();
			}
			catch(Exception ex) {
				json_string_weather = "";
				if(is_debug)
	            	System.err.println("Weather API not responding to HTTP request: " + ex.getMessage());
			}
		}
	}
	
	public void toListFromJsonParser(wot_type _type) throws Exception {
		
        if(_type == wot_type.twitter) {
        	
        	JsonParser parser = new JsonParser();
            JsonArray jarray = parser.parse(json_string_twitter).getAsJsonArray();
            Gson gson = new Gson();
            
            WoTDataFetcher wdf = new WoTDataFetcher();
            wdf.prepareForFetchingLess();
            
            if(is_debug)
    			System.out.println("processing new batch of tweet...");
            
	        for(JsonElement obj : jarray )
	        {
	        	TwitterObject tweet = null;
	        	try {
	        		tweet = gson.fromJson(obj , TwitterObject.class);
	        	}
	        	catch(Exception ex){
	        		System.out.println("Current tweet object cannot be parsed because: " + ex.getMessage());
	        		continue;
	        	}
	        	
	        	//remove duplicate
	        	if(ltweets_all.containsKey(tweet.getId())) {
	        		System.out.println("tweet already exist in DB, removed for duplicates...");
	        	}
	        	else {
		        	double lat = tweet.getLatitude();
		        	double lng = tweet.getLongitude();
		        	if (!region_info.isVancouver(lat, lng)) {
		        		System.out.println("tweet is out of bound of Vancouver, neglected...");
		        	}
		        	else {
		        		
		        		if(is_debug)
		        			System.out.println("INCOMING NEW TWEET! id:" + tweet.getId());
		        		
		        		
		        		//calculate weather score
		        		tweet.calculateWeatherScore();
		        		if(is_debug)
		        			System.out.println(tweet.getId() + " calculating weather score successful!");

		        		//set region
		        		if(is_debug)
		        			System.out.println(tweet.getId() + " getting region...");
		        		int region_index = region_info.classifyIntoRegion(lat, lng, tweet.getWeather_score(), tweet.getSentiment());
		        		tweet.setRegion(region_index);
		        		if(is_debug)
		        			System.out.println(tweet.getId() + " getting region successful!");
		        		
		        		//add current tweet to list
		        		ltweets_incoming.add(tweet);
		        		ltweets_all.put(tweet.getId(), tweet);
		        		
			        	if(is_debug)
				        	System.out.println(tweet.printInfo());
		        		
		        	}
	        	}
	        }
	        
	        if(is_debug)
    			System.out.println("current batch of tweet finished processing!");
        }

	}
	
	public void removeDuplicates(wot_type _type) {
		
		if(_type == wot_type.twitter) {
			//check to see if all tweets contain the current incoming list, if it does, remove it
			for(int i = 0; i < ltweets_incoming.size(); i++) {
				if(ltweets_all.containsKey(ltweets_incoming.get(i).getId())) {
					ltweets_incoming.remove(i);
					i--;
				}
			}
		}
		
	}
	
	public void updateAllList(wot_type _type) {
		
		if(_type == wot_type.twitter) {
			//add tweets processed to the tweets all list
			for(int i = 0; i < ltweets_incoming.size(); i++) {
				ltweets_all.put(ltweets_incoming.get(i).getId(), ltweets_incoming.get(i));
			}
		}
	}

	public void addToTweets_all(ArrayList<TwitterObject> _ltweets) {
		
		for(int i = 0; i < _ltweets.size(); i++) {
			if(!ltweets_all.containsKey(_ltweets.get(i))) {
				ltweets_all.put(_ltweets.get(i).getId(), _ltweets.get(i));
			}
		}
	}
	
	public HashMap<Integer, TwitterObject> gettweets_all() {
		return ltweets_all;
	}
	
	public ArrayList<TwitterObject> gettweets_incoming() {
		return ltweets_incoming;
	}
	
	public void clear_tweet_incoming() {
		ltweets_incoming.clear();
	}

	public int getRegion_count() {
		return region_info.getRegionCount();
	}
	
	public void updateRegionScoreForDBData() {
		for(Map.Entry<Integer, TwitterObject> entry: ltweets_all.entrySet()) {
			region_info.classifyIntoRegion(entry.getValue().getLatitude(),
					entry.getValue().getLongitude(),
					entry.getValue().getWeather_score(),
					entry.getValue().getSentiment());
		}
	}
	
	public ArrayList<regionX> getCurrentlRegionObjectsForTimePlay() {
		return region_info.getCurrentlRegionObjectForTimePlay();
	}
	
	public String getlJsonRegionObject() {
		return region_info.getJsonRegionObject();
	}
	
	public Boolean clearCurrentRegionWeatherSentimentScores() {
		return region_info.clearRegionScores();
	}

}