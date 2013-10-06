package ca.ubc.magic.enph479;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

import com.ubc.magic.enph479.builder.TweetCluster;
import com.ubc.magic.enph479.builder.TweetInstance;

import moa.cluster.Cluster;
import moa.cluster.Clustering;
import moa.clusterers.AbstractClusterer;
import moa.clusterers.ClusterGenerator;
import moa.clusterers.clustree.ClusTree;
import moa.gui.visualization.DataPoint;
import moa.streams.clustering.RandomRBFGeneratorEvents;
import weka.core.Attribute;
import weka.core.DenseInstance;
import weka.core.Instance;
import weka.core.Instances;
import weka.core.neighboursearch.BallTree;
import weka.core.neighboursearch.LinearNNSearch;
import weka.core.neighboursearch.NearestNeighbourSearch;

public class ClusteringExample {
	/**
	 * @param args
	 * @throws Exception 
	 */
	public static void main(String[] args) throws Exception {
		
		try {
		
			int totalInstances = 10;
		
			RandomRBFGeneratorEvents stream = new RandomRBFGeneratorEvents();
			AbstractClusterer clusterer = new ClusTree();
			
			stream.prepareForUse();
			clusterer.prepareForUse();
			
			System.err.println(stream.getHeader());
			int m_timestamp = 0;
		
			Clustering clustering0 = null;
		
			//Path path = Paths.get("/home/chris/Desktop/example.csv");
		
			//try(BufferedWriter writer = Files.newBufferedWriter(path, Charset.defaultCharset(), StandardOpenOption.WRITE))  {

			ArrayList<TweetInstance> tweetList = new ArrayList<TweetInstance>();
		
			while(m_timestamp < totalInstances && stream.hasMoreInstances()){
				Instance next = stream.nextInstance();
				DataPoint point0 = new DataPoint(next,m_timestamp);
				Instance traininst0 = new DenseInstance(point0);
				
				if(clusterer instanceof ClusterGenerator)
					traininst0.setDataset(point0.dataset());
				else
					traininst0.deleteAttributeAt(point0.classIndex());
			
				tweetList.add(new TweetInstance(traininst0, m_timestamp));
				System.out.println(traininst0);
				/*double[] nums = traininst0.toDoubleArray();
				writer.write(String.format("%f", nums[0]) + "," + String.format("%f", nums[1]));
				writer.newLine();*/

				clusterer.trainOnInstanceImpl(traininst0);
				Clustering gtClustering0 = ((RandomRBFGeneratorEvents)stream).getMicroClustering();
				Clustering microC = clusterer.getMicroClusteringResult();
				clustering0 = moa.clusterers.KMeans.gaussianMeans(gtClustering0, microC);
				m_timestamp++;
			}
		
			//writer.newLine(); writer.newLine(); writer.newLine();
		
			//print each cluster centers
			for (int i = 0; i < clustering0.getClustering().size(); i++) {
				Cluster c = clustering0.getClustering().get(i);
				c.setId(i);
				double[] center = c.getCenter();
				//writer.write(String.format("%f", center[0]) + "," + String.format("%f", center[1]));
				//writer.newLine();
				//System.err.println("ID " + c.getId() + ": " + center[0] + ", " + center[1] + ", Radius: " + ((SphereCluster) c).getRadius() );
				System.out.println(c.getInfo());
			}
		
			mapDataPointsToClusters(clustering0, tweetList);
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw e;
		}
		
		System.out.println("Clustering Finished");
		
		//} 

	}
	
	public static void mapDataPointsToClusters(Clustering clusterSets, ArrayList<TweetInstance> tweetList) throws Exception {
		try {
			int numberOfClusters = clusterSets.getClustering().size();

			ArrayList<TweetCluster> tweetClusters = new ArrayList<TweetCluster>();
			HashMap<List<Double>, Double> clusterMap = new HashMap<List<Double>, Double>();
			for (Cluster c: clusterSets.getClustering()) {
				tweetClusters.add(new TweetCluster(c));
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
			
			for (TweetInstance t : tweetList) {
				Instance nearestInstance = nearestNeighbour.nearestNeighbour(t);
				Double clusterId = (Double) clusterMap.get(arrayToList(nearestInstance.toDoubleArray()));
				t.setClusterId(clusterId);
				tweetClusters.get(clusterId.intValue()).addTweetMembers(t.getId());
			}
			
			for(TweetCluster t : tweetClusters) {
				System.out.println("Cluster center: [" 
									+ t.getCluster().getCenter()[0] + ", " 
									+ t.getCluster().getCenter()[1] + "], ClusterId: " 
									+ t.getCluster().getId());
				for (int i : t.getTweetIds())
					System.out.print(i + "(" + tweetList.get(i) + "), ");
				System.out.println("");
			}

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
	}
}
