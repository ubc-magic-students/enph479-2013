package ca.ubc.magic.enph479;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;

import com.ubc.magic.enph479.builder.TweetInstance;

public class WDF_Driver {

	public static void main(String[] args) throws Exception {
		
		WoTDataFetcher wdf = new WoTDataFetcher();
		int fetch_interval = 60; //in seconds
		
		String start_datetime = "2013 Sep 29 23:11:00";
		
		/*
		Date date_now = new Date();
		DateFormat date_format = new SimpleDateFormat("yyyy MMM dd HH:mm:ss");
		String start_datetime = date_format.format(date_now);
		*/
		
		if(!wdf.prepareForFetching(false, fetch_interval, start_datetime)) {
			System.out.println("Error while initializing WotDataFetcher...");
			return;
		}
		
		//wdf.fetchDataExample();
		ArrayList<TweetInstance> linstance = new ArrayList<TweetInstance>();
		for(int i = 0; i < 10; i++) {
			linstance = wdf.fetchData();
			//Thread.sleep((long) (fetch_interval * 1000 * 0.9));
		}
		
		HashMap<Integer, TwitterObject> tmp = wdf.getAllTweetsData();
		int a = 1;
		a = a + 1;
		
	}
}
