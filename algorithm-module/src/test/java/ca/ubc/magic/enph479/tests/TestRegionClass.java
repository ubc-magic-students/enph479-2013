package ca.ubc.magic.enph479.tests;

import static org.junit.Assert.*;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;

import ca.ubc.magic.enph479.builder.Region;
import ca.ubc.magic.enph479.builder.TwitterObject;

public class TestRegionClass {
	@Test
	public void testSetAveragesMethod() {
		List<TwitterObject> tweetObjects = new ArrayList<TwitterObject>();
		TwitterObject to1 = new TwitterObject();
		to1.setSentimentPolarity(3);
		to1.setWeatherScore(4.0);
		TwitterObject to2 = new TwitterObject();
		to2.setSentimentPolarity(2);
		to2.setWeatherScore(6.0);
		tweetObjects.add(to1);
		tweetObjects.add(to2);
		
		Region region1 = new Region("region1");
		region1.setAverages(tweetObjects);
		
		List<TwitterObject> tweetObjects2 = new ArrayList<TwitterObject>();
		TwitterObject to3 = new TwitterObject();
		to3.setSentimentPolarity(1);
		to3.setWeatherScore(5.0);
		TwitterObject to4 = new TwitterObject();
		to4.setSentimentPolarity(1);
		to4.setWeatherScore(3.0);
		tweetObjects2.add(to3);
		tweetObjects2.add(to4);
		
		region1.setAverages(tweetObjects2);
		
		assertEquals(1.0 , region1.getCurrentSentimentAverage(), 0.0);
		assertEquals(4.0 , region1.getCurrentWeatherScoreAverage(), 0.0);
		assertEquals(1.75, region1.getSentimentAverageOverTime(), 0.0);
		assertEquals(4.5, region1.getWeatherScoreAverageOverTime(), 0.0);
		
	}
	
}
