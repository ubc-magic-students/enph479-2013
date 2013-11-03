package ca.ubc.magic.enph479.builder;

import java.util.ArrayList;
import java.util.List;

public class Region {
	
	private String name = null;
	private List<Integer> tweetIds = new ArrayList<Integer>();
	private double sentimentAverageOverTime = 0.0;
	private double weatherScoreAverageOverTime = 0.0;
	private double currentSentimentAverage = 0.0;
	private double currentWeatherScoreAverage = 0.0;
	
	public Region(String name) {
		this.name = name;
	}
	
	public boolean reset() {
		this.sentimentAverageOverTime = 0.0;
		this.weatherScoreAverageOverTime = 0.0;
		return true;
	}

	public List<Integer> getTweetIds() {
		return tweetIds;
	}

	public boolean addTweetIds(int id) {
		if (tweetIds.add(id)) {
			System.out.println("New tweet added to " + this.name);
			return true;
		}
		System.out.println("Failed to add tweet to " + this.name);
		return false;
	}
	
	public int getNumTweets() {
		return tweetIds.size();
	}

	public double getSentimentAverage() {
		return sentimentAverageOverTime;
	}

	public void setSentimentAverage(List<Double> tweetList) {
		double sum = this.sentimentAverageOverTime * tweetIds.size();
		for (double d : tweetList) {
			sum += d;
		}
		this.sentimentAverageOverTime = sum/tweetIds.size();
	}
	
	public void setWeatherScoreAverage(List<Double> tweetList) {
		double sum = this.weatherScoreAverageOverTime * tweetIds.size();
		for (double d : tweetList) {
			sum += d;
		}
		this.weatherScoreAverageOverTime = sum/tweetIds.size();
	}

	public double getWeatherScoreAverage() {
		return weatherScoreAverageOverTime;
	}
	
	public String toJSONFormat() {
		StringBuffer buffer = new StringBuffer("");
		buffer.append("\"" + this.name + "\": {")
			.append("\"count\":" + this.tweetIds.size())
			.append("\"sentimentAverage\":" + this.sentimentAverageOverTime)
			.append("\"weatherAverage\":" + this.weatherScoreAverageOverTime)
			.append("\"tweetIds\": [" );
		
		for (int i : this.tweetIds) {
			buffer.append(i + ",");
		}
		buffer.append("]" + "}");
		
		return buffer.toString();
	}
	
}
