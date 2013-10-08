package ca.ubc.magic.enph479;

import java.io.BufferedWriter;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.HashMap;

import ca.ubc.magic.enph479.builder.TweetCluster;
import ca.ubc.magic.enph479.builder.TweetInstance;
import moa.gui.visualization.DataPoint;
import moa.streams.clustering.RandomRBFGeneratorEvents;
import weka.core.Instance;

public class ClusteringExample {
	/**
	 * @param args
	 * @throws Exception 
	 */
	public static void main(String[] args) throws Throwable {
		
		try {
			int totalInstances = 20;
			final int numClusters = 6;
		
			RandomRBFGeneratorEvents stream = new RandomRBFGeneratorEvents();
			
			stream.prepareForUse();
			
			System.err.println(stream.getHeader());
			int m_timestamp = 0;
			
			TweetClusterer clusterer = new TweetClusterer();
			HashMap<Integer, Instance> allTweets = new HashMap<Integer, Instance>();
			ArrayList<TweetInstance> newTweets = new ArrayList<TweetInstance>();
			while(m_timestamp < totalInstances && stream.hasMoreInstances()){
				Instance next = stream.nextInstance();
				DataPoint point0 = new DataPoint(next,m_timestamp);
				Instance traininst0 = new TweetInstance(point0, m_timestamp);
				traininst0.deleteAttributeAt(point0.classIndex());
				System.out.println(traininst0);
				newTweets.add((TweetInstance)traininst0);
				allTweets.put(m_timestamp, traininst0);
				m_timestamp++;
			}
			long startTime = System.currentTimeMillis();
			ArrayList<TweetCluster> clusters = clusterer.cluster(newTweets, allTweets, numClusters);
			long finishTime = System.currentTimeMillis();
			
			Path path = Paths.get("/home/chris/Desktop/example.csv");
			
			
			try(BufferedWriter writer = Files.newBufferedWriter(path, Charset.defaultCharset(), StandardOpenOption.WRITE))  {
				int tweetCount = 0;
				for(TweetCluster t : clusters) {
					writer.write("ClusterId:,"+ t.getCluster().getId() + "\n");
					writer.write("Cluster center:," + t.getCluster().getCenter()[0] + "," + t.getCluster().getCenter()[1] + "\n");
					writer.write("Cluster radius:," + t.getCluster().getRadius() + "\n");
					writer.newLine();
					for(int id : t.getTweetIds()) {
						TweetInstance ti = (TweetInstance) allTweets.get(id);
						writer.write(ti.toDoubleArray()[0] + ", " + ti.toDoubleArray()[1] + "\n");
						tweetCount++;
					}
					
					writer.newLine(); writer.newLine();
					
				}
				System.out.println("Total number of tweets: " + tweetCount);
				System.out.println("Time to run k-nearest neighbours on " + totalInstances + "tweets (ms): " + (finishTime-startTime));
			}
			
		} catch (Throwable e) {
			e.printStackTrace();
		}
		
		System.out.println("Clustering Finished");
		

	}
	
}
