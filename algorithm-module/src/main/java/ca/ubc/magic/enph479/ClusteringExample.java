package ca.ubc.magic.enph479;

import java.io.BufferedWriter;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ubc.magic.enph479.builder.TweetCluster;
import com.ubc.magic.enph479.builder.TweetInstance;
import com.ubc.magic.enph479.builder.UniqueRandomNumberGenerator;

import moa.cluster.Cluster;
import moa.cluster.Clustering;
import moa.clusterers.AbstractClusterer;
import moa.clusterers.ClusterGenerator;
import moa.clusterers.clustream.Clustream;
import moa.clusterers.clustree.ClusTree;
import moa.gui.visualization.DataPoint;
import moa.streams.clustering.RandomRBFGeneratorEvents;
import weka.core.Attribute;
import weka.core.DenseInstance;
import weka.core.Instance;
import weka.core.Instances;
import weka.core.neighboursearch.BallTree;
import weka.core.neighboursearch.NearestNeighbourSearch;

public class ClusteringExample {
	/**
	 * @param args
	 * @throws Exception 
	 */
	public static void main(String[] args) throws Throwable {
		
		try {
			int totalInstances = 10;
			final int numClusters = 4;
		
			RandomRBFGeneratorEvents stream = new RandomRBFGeneratorEvents();
			
			stream.prepareForUse();
			
			System.err.println(stream.getHeader());
			int m_timestamp = 0;
			
			TweetClusterer clusterer = new TweetClusterer();
			ArrayList<TweetInstance> tweetList = new ArrayList<TweetInstance>();
			while(m_timestamp < totalInstances && stream.hasMoreInstances()){
				Instance next = stream.nextInstance();
				DataPoint point0 = new DataPoint(next,m_timestamp);
				Instance traininst0 = new TweetInstance(point0, m_timestamp);
				traininst0.deleteAttributeAt(point0.classIndex());
				System.out.println(traininst0);
				tweetList.add((TweetInstance)traininst0);			
				m_timestamp++;
			}
			long startTime = System.currentTimeMillis();
			ArrayList<TweetCluster> clusters = clusterer.cluster(tweetList, numClusters);		
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
						TweetInstance ti = clusterer.getTweetMap().get(id);
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
	
	/*public static ArrayList<TweetCluster> mapDataPointsToClusters(Clustering clusterSets, HashMap<Integer, TweetInstance> tweetInstanceMap) throws Exception {
		try {
			int numberOfClusters = clusterSets.getClustering().size();

			ArrayList<TweetCluster> tweetClusterList = new ArrayList<TweetCluster>();
			HashMap<List<Double>, Double> clusterMap = new HashMap<List<Double>, Double>();
			for (Cluster c: clusterSets.getClustering()) {
				tweetClusterList.add(new TweetCluster(c));
				clusterMap.put(Collections.unmodifiableList(arrayToList(c.getCenter())), c.getId());
			}
			
			ArrayList<Attribute> atts = new ArrayList<Attribute>(2);
			atts.add(new Attribute("latitude"));
			atts.add(new Attribute("logitude"));
			Instances centerInstances = new Instances("ClusterCenterInstances", atts , 0);
			
			for (int i = 0; i < numberOfClusters; i++) {
				centerInstances.add(new DenseInstance(1, clusterSets.getClustering().get(i).getCenter()));
			}
			
			NearestNeighbourSearch nearestNeighbour = new BallTree();
			nearestNeighbour.setInstances(centerInstances);
			
			for (Map.Entry<Integer, TweetInstance> entry : tweetInstanceMap.entrySet()) {
				Instance nearestInstance = nearestNeighbour.nearestNeighbour(entry.getValue());
				Double clusterId = (Double) clusterMap.get(arrayToList(nearestInstance.toDoubleArray()));
				entry.getValue().setClusterId(clusterId);
				tweetClusterList.get(clusterId.intValue()).addTweetMembers(entry.getKey());
			}
			
			return tweetClusterList;

		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
		
	}
	
	public static List<Double> arrayToList(double[] array) {
		List<Double> list = new ArrayList<Double>();
		for (double d : array) {
			list.add(d);
		}
		
		return list;
	}*/
}
