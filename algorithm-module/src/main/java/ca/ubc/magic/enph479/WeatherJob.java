package ca.ubc.magic.enph479;

import java.net.ConnectException;
import java.net.Socket;
import java.util.ArrayList;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.SchedulerContext;

import com.google.gson.Gson;

import ca.ubc.magic.enph479.builder.TweetCluster;
import ca.ubc.magic.enph479.builder.TweetClusterJSONObject;
import ca.ubc.magic.enph479.builder.TweetInstance;
import ca.ubc.magic.enph479.builder.WeatherObject;

public class WeatherJob implements Job{

	@Override
	public void execute(JobExecutionContext arg0) throws JobExecutionException {
		try {
			SchedulerContext schedulerContext = arg0.getScheduler().getContext();
			TweetClusterer clusterer = (TweetClusterer) schedulerContext.get("clusterer");
			WoTDataFetcher wdf = (WoTDataFetcher) schedulerContext.get("wdf");
			ArrayList<TweetCluster> tweetClusters = new ArrayList<TweetCluster>();
			ArrayList<TweetInstance> linstance = new ArrayList<TweetInstance>();
			Gson gson = new Gson();

			linstance = wdf.fetchData();
			
			if (!linstance.isEmpty()) {	
				Socket nodejs  = new Socket("localhost", 8080);
				System.out.println("new tweet instances found!");
				tweetClusters = clusterer.cluster(linstance, wdf.getAllTweetsData());
			
				StringBuffer buffer = new StringBuffer("{");
				for (int i =0; i < tweetClusters.size(); i++) {
					double [] center = tweetClusters.get(i).getCluster().getCenter();
					WeatherObject weather = wdf.getWeatherFromLatLng(center[0], center[1]);
					if (i != 0)
						buffer.append(",");
					buffer.append("\"cluster" + i + "\":" + gson.toJson(new TweetClusterJSONObject(tweetClusters.get(i), weather, wdf.getAllTweetsData())));
				}
				buffer.append("}");
				nodejs.getOutputStream().write(buffer.toString().getBytes("UTF-8"));
				nodejs.getOutputStream().flush();
				nodejs.close();
			}	
			
		} catch (ConnectException c) {
			System.err.println("No one is listening to the port");
		} catch (Exception e) {
			System.err.println("Error while executing weather job.");
			e.printStackTrace();
		}
		
	}

}
