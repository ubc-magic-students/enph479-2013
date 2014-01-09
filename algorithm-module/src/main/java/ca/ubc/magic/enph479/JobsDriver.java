package ca.ubc.magic.enph479;

import java.io.DataOutputStream;
import java.net.ConnectException;
import java.net.Socket;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import ca.ubc.magic.enph479.builder.DataRetrievalModule;

public class JobsDriver {

	public static void main(String[] args) {
		try {
			final int job_interval = 5;
			final int fetch_interval = job_interval*2; //in seconds
			String start_datetime = "undefined";
			boolean is_demo = false; //fetch from a custom defined starting time if true, current starting time is false
			final int TCPPORT = 8080;
			WoTDataFetcher wdf = null;
			
			//retrive from Bennu for old data first
			DataRetrievalModule drm = new DataRetrievalModule();
			wdf = drm.retrieveFromBennu();
			drm.wrappingUpRetrivalModule();
			
			//get now datetime
			Date date_now = new Date();
			DateFormat date_format = new SimpleDateFormat("yyyy MMM dd HH:mm:ss");
			//date_format.setTimeZone(TimeZone.getTimeZone("UTC"));
			start_datetime = date_format.format(date_now);
			
			//continue fetching as in real time
			wdf.updateFetchingRules(job_interval, fetch_interval, start_datetime);
			
			while(true) {
				String message = wdf.fetchNewData(false);
				if (message.length() != 0) {
					//System.out.println("New Tweets detected!");
					
					try {
						Socket nodejs  = new Socket("localhost", TCPPORT);
						DataOutputStream outbound = new DataOutputStream(nodejs.getOutputStream());
						outbound.write(message.getBytes("UTF-8"));
						nodejs.close();
					}
					catch (ConnectException c) {
						System.err.println("No one is listening to the port");
					}
				}
				Thread.sleep(job_interval*1000);
			}
			
		} catch (Throwable t) {
			System.err.println("Error while initializing WotDataFetcher...");
			t.printStackTrace();
		}

	}

}
