package ca.ubc.magic.enph479.builder;

import java.util.ArrayList;
import java.util.List;

@Deprecated
public class Region {
	
	private String name = null;
	//TODO: Need to remove tweetIds if they are tweets are too old
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
	
	public int getNumTweets() {
		return tweetIds.size();
	}

	public double getSentimentAverageOverTime() {
		return sentimentAverageOverTime;
	}
	
	public double getCurrentSentimentAverage() {
		return this.currentSentimentAverage;
	}
	
	public double getCurrentWeatherScoreAverage() {
		return this.currentWeatherScoreAverage;
	}
	
	public double getWeatherScoreAverageOverTime() {
		return weatherScoreAverageOverTime;
	}

	public void setAverages(List<TwitterObject> tweetList) {
		if (tweetList.isEmpty())
			return;
		
		double currentSentimentSum = 0.0;
		double sentimentSumOverTime = this.sentimentAverageOverTime * tweetIds.size();
		double currentWeatherScoreSum = 0.0;
		double weatherScoreSumOverTime = this.weatherScoreAverageOverTime * tweetIds.size();
		for (TwitterObject o : tweetList) {
			addTweetIds(o.getId());
			currentWeatherScoreSum += o.getWeather_score();
			weatherScoreSumOverTime += o.getWeather_score();
			currentSentimentSum += o.getSentiment();
			sentimentSumOverTime += o.getSentiment();
		}
		this.currentSentimentAverage = currentSentimentSum/tweetList.size();
		this.sentimentAverageOverTime = sentimentSumOverTime/tweetIds.size();
		this.currentWeatherScoreAverage = currentWeatherScoreSum/tweetList.size();
		this.weatherScoreAverageOverTime = weatherScoreSumOverTime/tweetIds.size();
	}
	
	public String toJSONFormat() {
		StringBuffer buffer = new StringBuffer("");
		buffer.append("\"" + this.name + "\": {")
			.append("\"currentSentimentAverage\":" + this.currentSentimentAverage + ",")
			.append("\"currentWeatherAverage\":" + this.currentWeatherScoreAverage + ",")
			.append("\"sentimentAverageOverTime\":" + this.sentimentAverageOverTime + ",")
			.append("\"weatherAverageOverTime\":" + this.weatherScoreAverageOverTime + ",")
			.append("\"tweetCount\":" + this.tweetIds.size() + ",")
			.append("\"tweetIds\": "  + tweetIds.toString())
			.append("}");
		return buffer.toString();
	}
	
	private boolean addTweetIds(int id) {
		if (tweetIds.add(id)) {
			System.out.println("New tweet added to " + this.name);
			return true;
		}
		System.out.println("Failed to add tweet to " + this.name);
		return false;
	}
	
}
