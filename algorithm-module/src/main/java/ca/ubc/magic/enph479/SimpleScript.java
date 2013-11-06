package ca.ubc.magic.enph479;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import ca.ubc.magic.enph479.builder.TweetInstance;
import ca.ubc.magic.enph479.builder.TwitterObject;
import ca.ubc.magic.enph479.builder.WeatherObject;

public class SimpleScript {

	public static void main(String[] args) {
		try {
		//declare variables
			final int job_interval = 15;
			final int fetch_interval = 15*2; //in seconds
				String start_datetime = "undefined";
				boolean is_demo = true; //fetch from a custom defined starting time if true, current starting time is false
				
				//initialize WoTDataFetcher
				WoTDataFetcher wdf = new WoTDataFetcher();
				
				if(is_demo)
				{
					start_datetime = "2013 Oct 11 20:48:00";
				}
				else {
					Date date_now = new Date();
					DateFormat date_format = new SimpleDateFormat("yyyy MMM dd HH:mm:ss");
					start_datetime = date_format.format(date_now);
				}
				
				//prepare for fetching
				if(!wdf.prepareForFetching(fetch_interval, job_interval, start_datetime)) {
					System.out.println("Error while initializing WotDataFetcher...");
					return;
				}
				
				wdf.fetchData();
				
				HashMap<Integer, TwitterObject> allTweets = wdf.getAllTweetsData();
				System.err.println(allTweets.size());
				for (Map.Entry<Integer, TwitterObject> entry : allTweets.entrySet()) {
					WeatherObject wet = wdf.getWeatherFromLatLng(entry.getValue().getLatitude(), entry.getValue().getLongitude());
					double mean = (wet.getTemperature() + wet.getPrecipitation())/2;
					System.out.println(mean + "," + entry.getValue().getSentimentPolarity());
					
				}
				
				
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

}
