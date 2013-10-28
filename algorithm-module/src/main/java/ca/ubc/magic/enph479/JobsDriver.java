package ca.ubc.magic.enph479;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Map;

import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SimpleScheduleBuilder;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.quartz.impl.StdSchedulerFactory;

import ca.ubc.magic.enph479.builder.TweetInstance;
import ca.ubc.magic.enph479.builder.TwitterObject;

public class JobsDriver {

	public static void main(String[] args) {
		try {
			int fetch_interval = 30; //in seconds
			String start_datetime = "undefined";
			boolean is_demo = false; //fetch from a custom defined starting time if true, current starting time is false
			
			//initialize WoTDataFetcher
			WoTDataFetcher wdf = new WoTDataFetcher();
			
			if(is_demo)
			{
				start_datetime = "2013 Oct 11 20:48:00";
			}
			else {
				Date date_now = new Date();
				DateFormat date_format = new SimpleDateFormat("yyyy MMM dd HH:mm:ss");
				start_datetime = date_format.format(date_now);
			}
			
			//prepare for fetching
			if(!wdf.prepareForFetching(fetch_interval, start_datetime)) {
				System.out.println("Error while initializing WotDataFetcher...");
				return;
			}

			TweetClusterer clusterer = new TweetClusterer();
			
			//If Tweet objects are found in the database, train the clusterer before executing jobs
			for (Map.Entry<Integer, TwitterObject> entry : wdf.getAllTweetsData().entrySet()) {
				TweetInstance inst = entry.getValue().toTweetInstance(2);
				clusterer.trainClusterer(inst);
			}
		
			JobDetail job = JobBuilder.newJob(WeatherJob.class)
				.withIdentity("WeatherJob")
				.build();
		
			Trigger trigger = TriggerBuilder.newTrigger()
				.withSchedule(SimpleScheduleBuilder.simpleSchedule().withIntervalInSeconds(15).repeatForever())
				.build();
		
			Scheduler schedule = StdSchedulerFactory.getDefaultScheduler();
			// Pass objects to Job
			schedule.getContext().put("wdf", wdf);
			schedule.getContext().put("clusterer", clusterer);
			schedule.scheduleJob(job, trigger);
			schedule.start();
			
		} catch (Throwable t) {
			System.err.println("Error while initializing WotDataFetcher...");
			t.printStackTrace();
		}

	}

}
