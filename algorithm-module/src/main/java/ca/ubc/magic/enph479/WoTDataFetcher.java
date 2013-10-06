package ca.ubc.magic.enph479;

import java.util.ArrayList;

import weka.core.Instance;

public class WoTDataFetcher {

	public static void main(String[] args) throws Exception {
		
		DataManipulationProcessor dmp = new DataManipulationProcessor();
		
		String startTime = dmp.ToEpochTime("2013 Sep 29 23:10:00 UTC");
		String endTime = dmp.ToEpochTime("2013 Sep 29 23:20:00 UTC");
		/* testing for 1 twitter */
		//String startTime = dmp.ToEpochTime("2013 Sep 29 23:11:00 UTC");
		//String endTime = dmp.ToEpochTime("2013 Sep 29 23:11:10 UTC");
		/* testing for 0 twitter */
		//String startTime = dmp.ToEpochTime("2013 Sep 29 23:11:00 UTC");
		//String endTime = dmp.ToEpochTime("2013 Sep 29 23:11:01 UTC");
		
		String jsonString = dmp.GetJsonFromWoT(startTime, endTime);
		ArrayList<TwitterObject> lTwitter = dmp.JsonParserToList(jsonString);
		ArrayList<Instance> lInstance = dmp.PrepareForCluster(lTwitter);
		
	}
}
