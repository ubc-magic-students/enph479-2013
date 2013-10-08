package ca.ubc.magic.enph479;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import moa.cluster.Cluster;
import moa.cluster.Clustering;
import moa.clusterers.AbstractClusterer;
import moa.clusterers.clustree.ClusTree;
import weka.core.Attribute;
import weka.core.DenseInstance;
import weka.core.Instance;
import weka.core.Instances;
import weka.core.neighboursearch.BallTree;
import weka.core.neighboursearch.NearestNeighbourSearch;

import com.ubc.magic.enph479.builder.TweetCluster;
import com.ubc.magic.enph479.builder.TweetInstance;
import com.ubc.magic.enph479.builder.UniqueRandomNumberGenerator;

public class TweetClusterer {
	
	//private HashMap<Integer, Instance> tweetMap = new HashMap<Integer, Instance>();
	private AbstractClusterer clusterer = new ClusTree();
	private Clustering clustering;
	
	public TweetClusterer() {
		clusterer.prepareForUse();
	}
	
	/**
	 * 
	 * @param newTweets Must be in a form of [latitude, longitude]
	 * @param k
	 * @return
	 * @throws Exception
	 */
	public TweetClusterer cluster(ArrayList<TweetInstance> newTweets, int k) throws Exception {
		for (TweetInstance inst : newTweets) {
			clusterer.trainOnInstanceImpl(inst);
		}
		Clustering microC = clusterer.getMicroClusteringResult();
		Clustering randomClustering = new Clustering();
		
		if (k > microC.size())
			k = microC.size();
		
		UniqueRandomNumberGenerator random = new UniqueRandomNumberGenerator(microC.size());
		for(int i = 0; i < k ; i++) {
			randomClustering.add(microC.get(random.nextInt()));
		}
		
		clustering = moa.clusterers.KMeans.gaussianMeans(randomClustering, microC);
		
		for (int i = 0; i < clustering.getClustering().size(); i++) {
			clustering.getClustering().get(i).setId(i);
		}
		
		return this;
		
	}
	
	public ArrayList<TweetCluster> mapDataPointsToClusters(HashMap<Integer, Instance> tweetInstanceMap) throws Exception {
		try {
			int numberOfClusters = clustering.getClustering().size();

			ArrayList<TweetCluster> tweetClusterList = new ArrayList<TweetCluster>();
			HashMap<List<Double>, Double> clusterMap = new HashMap<List<Double>, Double>();
			for (Cluster c: clustering.getClustering()) {
				tweetClusterList.add(new TweetCluster(c));
				clusterMap.put(Collections.unmodifiableList(arrayToList(c.getCenter())), c.getId());
			}
			
			ArrayList<Attribute> atts = new ArrayList<Attribute>(2);
			atts.add(new Attribute("latitude"));
			atts.add(new Attribute("logitude"));
			Instances centerInstances = new Instances("ClusterCenterInstances", atts , 0);
			
			for (int i = 0; i < numberOfClusters; i++) {
				centerInstances.add(new DenseInstance(1, clustering.getClustering().get(i).getCenter()));
			}
			
			NearestNeighbourSearch nearestNeighbour = new BallTree();
			nearestNeighbour.setInstances(centerInstances);
			
			for (Map.Entry<Integer, Instance> entry : tweetInstanceMap.entrySet()) {
				Instance nearestInstance = nearestNeighbour.nearestNeighbour(entry.getValue());
				Double clusterId = (Double) clusterMap.get(arrayToList(nearestInstance.toDoubleArray()));
				tweetClusterList.get(clusterId.intValue()).addTweetMembers(entry.getKey());
			}
			
			return tweetClusterList;

		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
	}
	
	private static List<Double> arrayToList(double[] array) {
		List<Double> list = new ArrayList<Double>();
		for (double d : array) {
			list.add(d);
		}
		
		return list;
	}
	
}
