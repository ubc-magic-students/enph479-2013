package ca.ubc.magic.enph479;

import java.io.IOException;
import java.net.Socket;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.TimeZone;

import com.google.gson.Gson;

import ca.ubc.magic.enph479.builder.TweetInstance;

public class WDF_Driver {

	public static void main(String[] args) throws Exception {
		
		//declare variables
		final int job_interval = 60*60;
		final int fetch_interval = job_interval*2; //in seconds
		String start_datetime = "undefined";
		boolean is_testing = true; //fetch from a custom defined starting time if true, current starting time is false
		
		//initialize WoTDataFetcher
		WoTDataFetcher wdf = new WoTDataFetcher();
		System.setProperty("jsse.enableSNIExtension", "false");
		
		if(is_testing)
		{
			start_datetime = "2013 Nov 08 13:00:00";
		}
		else {
			Date date_now = new Date();
			DateFormat date_format = new SimpleDateFormat("yyyy MMM dd HH:mm:ss");
			//date_format.setTimeZone(TimeZone.getTimeZone("UTC"));
			start_datetime = date_format.format(date_now);
		}
		
		//prepare for fetching
		if(!wdf.prepareForFetching(fetch_interval, job_interval, start_datetime)) {
			System.out.println("Error while initializing WotDataFetcher...");
			return;
		}
		
		//start fetching using while/for loop
		while(true) {
			try {
				String jsonData = wdf.fetchNewData(false);
				System.out.println("Going through while loop.....");
				if(is_testing){
					//Thread.sleep(3000);
				}
				else{
					Thread.sleep((long) (fetch_interval * 1000 * 0.9));
				}
			}
			catch (Throwable t) {
				t.printStackTrace();
				System.err.println("Error in the driver.");
			}
		}
	}
}
