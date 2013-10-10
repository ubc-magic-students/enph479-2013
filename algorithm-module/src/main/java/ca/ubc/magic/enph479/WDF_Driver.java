package ca.ubc.magic.enph479;

import java.net.Socket;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;

import com.google.gson.Gson;

import ca.ubc.magic.enph479.builder.TweetCluster;
import ca.ubc.magic.enph479.builder.TweetClusterJSONObject;
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
		
		Socket nodejs = new Socket("localhost", 8080);
		Thread.sleep(2000);
		TweetClusterer clusterer = new TweetClusterer();
		ArrayList<TweetCluster> tweetClusters = new ArrayList<TweetCluster>();
		ArrayList<TweetInstance> linstance = new ArrayList<TweetInstance>();
		//start fetching using while/for loop
		for(int i = 0; i < 10; i++) {
			linstance = wdf.fetchData();
			tweetClusters = clusterer.cluster(linstance, wdf.getAllTweetsData(), 5);
			//Thread.sleep((long) (fetch_interval * 1000 * 0.9));
		}
		
		//getting all lists
		//HashMap<Integer, TwitterObject> tweets = wdf.getAllTweetsData();
		
		//get weather from lat and lng
		double[] centers = tweetClusters.get(0).getCluster().getCenter();
		WeatherObject weather = wdf.getWeatherFromLatLng(centers[0], centers[1]);
		Gson gson = new Gson();
		StringBuffer buffer = new StringBuffer("{");
		for (TweetCluster c : tweetClusters) {
			buffer.append(gson.toJson(new TweetClusterJSONObject(c, weather)));
		}
		buffer.append("}");
		nodejs.getOutputStream().write(buffer.toString().getBytes("UTF-8"));
		nodejs.getOutputStream().flush();
		System.out.println(gson.toJson(new TweetClusterJSONObject(tweetClusters.get(0), weather)));
		//System.out.println(weather);
	}
	
	
	
	
}
