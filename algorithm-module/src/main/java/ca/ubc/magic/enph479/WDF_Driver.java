package ca.ubc.magic.enph479;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;

import ca.ubc.magic.enph479.builder.TweetInstance;

public class WDF_Driver {

	public static void main(String[] args) throws Exception {
		
		//declare variables
		int fetch_interval = 60; //in seconds
		String start_datetime = "undefined";
		boolean is_demo = true; //fetch from a custom defined starting time if true, current starting time is false
		
		//initialize WoTDataFetcher
		WoTDataFetcher wdf = new WoTDataFetcher();
		
		if(is_demo)
		{
			start_datetime = "2013 Oct 8 22:27:41";
		}
		else {
			Date date_now = new Date();
			DateFormat date_format = new SimpleDateFormat("yyyy MMM dd HH:mm:ss");
			start_datetime = date_format.format(date_now);
		}
		
		//prepare for fetching
		if(!wdf.prepareForFetching(fetch_interval, start_datetime)) {
			System.out.println("Error while initializing WotDataFetcher...");
			return;
		}
		
		//start fetching using while/for loop
		ArrayList<TweetInstance> linstance = new ArrayList<TweetInstance>();
		for(int i = 0; i < 10; i++) {
			linstance = wdf.fetchData();
			//Thread.sleep((long) (fetch_interval * 1000 * 0.9));
		}
		
		//getting all lists
		HashMap<Integer, TwitterObject> tweets = wdf.getAllTweetsData();
		
		//get weather from lat and lng
		String weather = wdf.getWeatherFromLatLng(35, 139);
	}
}
