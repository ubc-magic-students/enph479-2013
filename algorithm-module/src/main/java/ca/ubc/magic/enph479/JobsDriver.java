package ca.ubc.magic.enph479;

import java.io.DataOutputStream;
import java.net.ConnectException;
import java.net.Socket;

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
			
			//continue fetching as in real time
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
			
		} catch (Throwable t) {
			System.err.println("Error while initializing WotDataFetcher...");
			t.printStackTrace();
		}
		
		/*try {
			final int job_interval = 5;
			final int fetch_interval = job_interval*2; //in seconds
			String start_datetime = "undefined";
			boolean is_demo = false; //fetch from a custom defined starting time if true, current starting time is false
			
			//retrive from Bennu for old data first
			DataRetrievalModule drm = new DataRetrievalModule();
			drm.retrieveFromBennu();
			drm.wrappingUpRetrivalModule();
			
			//initialize WoTDataFetcher
			WoTDataFetcher wdf = new WoTDataFetcher();
			
			if(is_demo)
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
				System.err.println("Error while initializing WotDataFetcher...");
				return;
			}
			
			//Initialize Jobs
			JobDetail job = JobBuilder.newJob(WeatherJob.class)
				.withIdentity("WeatherJob")
				.build();
		
			Trigger trigger = TriggerBuilder.newTrigger()
				.withSchedule(SimpleScheduleBuilder.simpleSchedule().withIntervalInSeconds(job_interval).repeatForever())
				.build();
		
			Scheduler schedule = StdSchedulerFactory.getDefaultScheduler();
			// Pass objects to Job
			schedule.getContext().put("wdf", wdf);
			schedule.scheduleJob(job, trigger);
			schedule.start();
			
			System.out.println("Job Started!");
			
		} catch (Throwable t) {
			System.err.println("Error while initializing WotDataFetcher...");
			t.printStackTrace();
		}*/

	}

}
