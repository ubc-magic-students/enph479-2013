package ca.ubc.magic.enph479.builder;

import java.util.ArrayList;

import ca.ubc.magic.enph479.WeatherObject;

/**
 * JSON object representing TweetCluster
 * 
 * @author chris.yoon90@gmail.com
 *
 */
public class TweetClusterJSONObject {
	private double clusterId = -1.0;
	private double centerLat = -1.0;
	private double centerLong = -1.0;
	private double clusterRadius = -1.0;
	private int numTweets = -1;
	private int[] tweetIDs = null;
	private WeatherObject weather = null;
	
	public TweetClusterJSONObject(TweetCluster tweetCluster, WeatherObject weather) {
		this.clusterId = tweetCluster.getCluster().getId();
		this.centerLat = tweetCluster.getCluster().getCenter()[0];
		this.centerLong = tweetCluster.getCluster().getCenter()[1];
		this.clusterRadius = tweetCluster.getCluster().getRadius();
		this.numTweets = tweetCluster.getTweetIds().size();
		this.tweetIDs = new int[this.numTweets];
		for (int i = 0; i < numTweets; i++) {
			this.tweetIDs[i] = tweetCluster.getTweetIds().get(i);
		}
		this.weather = weather;
		
	}
	
	
	public double getClusterId() {
		return clusterId;
	}
	public void setClusterId(int clusterId) {
		this.clusterId = clusterId;
	}
	
	public double getCenterLat() {
		return centerLat;
	}
	
	public void setCenterLat(double centerLat) {
		this.centerLat = centerLat;
	}
	
	public double getCenterLong() {
		return centerLong;
	}
	
	public void setCenterLong(double centerLong) {
		this.centerLong = centerLong;
	}
	
	public double getClusterRadius() {
		return clusterRadius;
	}
	
	public void setClusterRadius(int clusterRadius) {
		this.clusterRadius = clusterRadius;
	}
	
	public int getNumTweets() {
		return numTweets;
	}
	
	public void setNumTweets(int numTweets) {
		this.numTweets = numTweets;
	}
	
	public int[] getTweetIDs() {
		return tweetIDs;
	}
	
	public void setTweetIDs(int[] tweetIDs) {
		this.tweetIDs = tweetIDs;
	}
	
	public WeatherObject getWeather() {
		return weather;
	}
	public void setWeather(WeatherObject weather) {
		this.weather = weather;
	}
	
	
	
	
}
