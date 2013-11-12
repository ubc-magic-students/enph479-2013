package ca.ubc.magic.enph479.builder;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import ca.ubc.magic.enph479.WoTDataFetcher;

public class DataRetrievalModule {
	
	public void retrieveFromBennu() throws Exception {
	
		final int job_interval = 60 * 60;
		final int fetch_interval = job_interval * 2; // in seconds
		String start_datetime = "undefined";

		// initialize WoTDataFetcher
		WoTDataFetcher wdf = new WoTDataFetcher();
		System.setProperty("jsse.enableSNIExtension", "false");

		start_datetime = "2013 Nov 08 13:00:00";

		// prepare for fetching
		if (!wdf.prepareForFetching(fetch_interval, job_interval,
				start_datetime)) {
			System.out.println("Error while initializing WotDataFetcher...");
			return;
		}

		System.out.println("===================================\r\nStarting to Fetch from Bennu for old data...");
		// start fetching using while/for loop
		while (true) {
			try {
				
				//check for ref_time, if catching up to current time, return
				String ref_datetime = wdf.get_refDatetime();
				Date date_ref_time = new Date(ref_datetime);
				date_ref_time.setTime(date_ref_time.getTime() + 5 * 1000);
				Date date_current_time = new Date();
				if(date_ref_time.after(date_current_time)) {
					System.out.println("Finished Fetching from Bennu for old data...\r\n===================================");
					return;
				}
				
				String jsonData = wdf.fetchNewData();
				System.out.println("Going through while loop.....");
			} catch (Throwable t) {
				t.printStackTrace();
				System.err.println("Error in the driver.");
			}
		}
	}
	
}
