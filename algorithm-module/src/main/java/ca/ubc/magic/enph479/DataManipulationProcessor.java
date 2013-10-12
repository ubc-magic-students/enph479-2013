package ca.ubc.magic.enph479;

import java.net.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.io.*;

import net.sf.json.JSONSerializer;
import weka.core.Attribute;
import weka.core.DenseInstance;
import weka.core.Instance;
import weka.core.Instances;
import ca.ubc.magic.enph479.builder.TweetInstance;
import ca.ubc.magic.enph479.builder.TwitterObject;
import ca.ubc.magic.enph479.builder.WeatherObject;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;

/**
 * DataManipulationProcessor is the low level algorithm that actually process raw data processed from WoTkit
 * User has no access to this class
 * @author Richard
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
	
	private boolean is_debug = true;
	private String[] wot_url_tweet = new String[] {"http://wotkit.sensetecnic.com/api/sensors/2013enph479.tweets-in-vancouver/data?start=",
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
	
	public void getJsonFromWoT(wot_type _type, String _startTime, String _endTime) throws Exception {
		
		String url_1 = null, url_2 = null;
		
		if(_type == wot_type.twitter) {
			url_1 = wot_url_tweet[0];
			url_2 = wot_url_tweet[1];
			
			URL wot_url = new URL(url_1 + _startTime + url_2 + _endTime);
	        URLConnection con = wot_url.openConnection();
	        BufferedReader breader = new BufferedReader(
	                                new InputStreamReader(
	                                		con.getInputStream()));
	        /*String inputLine;
	        while ((inputLine = bReader.readLine()) != null) {
	            System.out.println(inputLine);
	        }*/
	        json_string_twitter = breader.readLine();
	        //if(is_debug)
	        //	System.out.println(json_string_twitter);
	        breader.close();
		}
	}
	
	public void getJsonFromWeb(web_type _type, double _lat, double _lng) throws Exception {
		
		String url_1 = null, url_2 = null;
		
		if(_type == web_type.weather) {
			url_1 = web_url_weather[0];
			url_2 = web_url_weather[1];
			
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
	}
	
	public void toListFromJsonParser(wot_type _type) throws Exception {
		
        if(_type == wot_type.twitter) {
        	
        	JsonParser parser = new JsonParser();
            JsonArray jarray = parser.parse(json_string_twitter).getAsJsonArray();
            Gson gson = new Gson();
            
	        for(JsonElement obj : jarray )
	        {
	        	TwitterObject tweet = gson.fromJson(obj , TwitterObject.class);
	        	double lat = tweet.getLatitude();
	        	double lon = tweet.getLongitude();
	        	if ( (lon < -123.020 && lon > -123.27) && (lat < 49.315 && lat > 49.195)) {
	        		tweet.setSentimentPolarity(TweetSentimentFetcher.doPost(tweet.getMessage()));
	        		ltweets_incoming.add(tweet);
	        		if(is_debug)
		            	System.out.println(tweet.printInfo());
	        	}
	        }
        }

	}
	
	public WeatherObject toWeatherFromJsonParser(web_type _type) {
		
        if(_type == web_type.weather) {
        	
        	JSONObject json = (JSONObject) JSONSerializer.toJSON(json_string_weather);
        	String weather = ((JSONObject)json.getJSONArray("weather").get(0)).getString("main");
        	String description = ((JSONObject)json.getJSONArray("weather").get(0)).getString("description");
        	double temperature = json.getJSONObject("main").getDouble("temp");
        	double pressure = json.getJSONObject("main").getDouble("pressure");
        	
        	weather_info.setWeather(weather);
        	weather_info.setDescription(description);
        	weather_info.setTemperature(temperature - 273.0);
        	weather_info.setPressure(pressure);
        	
        	return weather_info;
        }
        
        return weather_info;
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
	
	public ArrayList<TweetInstance> toWekaInstanceFromTwitterObj() {
        
        ArrayList<TweetInstance> linstance = new ArrayList<TweetInstance>();
		
        for(int i = 0; i < ltweets_incoming.size(); i++) {
			TweetInstance ti = new TweetInstance(1, new double[]{ltweets_incoming.get(i).getLatitude(),
					ltweets_incoming.get(i).getLongitude()}, ltweets_incoming.get(i).getId());
			linstance.add(ti);
		}
		
		return linstance;
	}
	
	public void updateAllList(wot_type _type) {
		
		if(_type == wot_type.twitter) {
			//add tweets processed to the tweets all list
			for(int i = 0; i < ltweets_incoming.size(); i++) {
				ltweets_all.put(ltweets_incoming.get(i).getId(), ltweets_incoming.get(i));
			}
		}
	}

	public HashMap<Integer, TwitterObject> gettweets_all() {
		return ltweets_all;
	}

}