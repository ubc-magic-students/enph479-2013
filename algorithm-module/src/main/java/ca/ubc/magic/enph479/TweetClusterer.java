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
import ca.ubc.magic.enph479.builder.TweetCluster;
import ca.ubc.magic.enph479.builder.TweetInstance;
import ca.ubc.magic.enph479.builder.UniqueRandomNumberGenerator;

/**
 * Class for clustering tweet instances.
 * 
 * @author chris.yoon90@gmail.com
 *
 */
public class TweetClusterer {
	
	private AbstractClusterer clusterer = new ClusTree();
	private ArrayList<TweetCluster> tweetClusterList = new ArrayList<TweetCluster>();
	
	public TweetClusterer() {
		clusterer.prepareForUse();
	}
	
	/**
	 * Clusters tweet instances into k clusters.
	 * 
	 * @param newTweets a list of TweetInstances in a form of [latitude, longitude]
	 * @param allTweets A hashmap of tweet objects mapped to their ids
	 * @param k number of clusters
	 * @return A list of TweetCluster objects
	 * @throws Exception
	 */
	public ArrayList<TweetCluster> cluster(ArrayList<TweetInstance> newTweets, HashMap<Integer, TwitterObject> allTweets, int k) throws Exception {
		if (newTweets.size() == 0)
			return tweetClusterList;
		
		for (TweetInstance inst : newTweets) {
			clusterer.trainOnInstanceImpl(inst);
		}
		Clustering microC = clusterer.getMicroClusteringResult();
		
		if (k > microC.size())
			k = microC.size();
		
		Clustering randomClustering = new Clustering();
		UniqueRandomNumberGenerator random = new UniqueRandomNumberGenerator(microC.size());
		for(int i = 0; i < k ; i++) {
			randomClustering.add(microC.get(random.nextInt()));
		}
		
		Clustering clustering = moa.clusterers.KMeans.gaussianMeans(randomClustering, microC);
		
		for (int i = 0; i < clustering.getClustering().size(); i++) {
			clustering.getClustering().get(i).setId(i);
		}
		
		tweetClusterList = nearestNeighbour(clustering, allTweets);
		
		return tweetClusterList;
		
	}
	
	private ArrayList<TweetCluster> nearestNeighbour(Clustering clustering, HashMap<Integer, TwitterObject> tweetInstanceMap) throws Exception {
			if (tweetInstanceMap.isEmpty())
				return tweetClusterList;
			
			int numberOfClusters = clustering.getClustering().size();

			ArrayList<TweetCluster> tweetClusterList = new ArrayList<TweetCluster>();
			HashMap<List<Double>, Double> mapClusterCentersToClusterId = new HashMap<List<Double>, Double>();
			for (Cluster c: clustering.getClustering()) {
				tweetClusterList.add(new TweetCluster(c));
				mapClusterCentersToClusterId.put(Collections.unmodifiableList(arrayToList(c.getCenter())), c.getId());
			}

			ArrayList<Attribute> atts = new ArrayList<Attribute>(2);
			Attribute latitude = new Attribute("latitude");
			Attribute longitude = new Attribute("longitude");
			atts.add(latitude);
			atts.add(longitude);
			Instances centerInstances = new Instances("ClusterCenterInstances", atts , 0);
			
			for (int i = 0; i < numberOfClusters; i++) {
				Instance tempInst = new DenseInstance(2);
				tempInst.setValue(latitude, clustering.getClustering().get(i).getCenter()[0]);
				tempInst.setValue(longitude, clustering.getClustering().get(i).getCenter()[1]);
				centerInstances.add(tempInst);
			}
			
			NearestNeighbourSearch nearestNeighbourSearch = new BallTree();
			nearestNeighbourSearch.setInstances(centerInstances);
			
			for (Map.Entry<Integer, TwitterObject> entry : tweetInstanceMap.entrySet()) {
				Instance tempTweetInst = new DenseInstance(2);
				tempTweetInst.setValue(latitude, entry.getValue().getLatitude());
				tempTweetInst.setValue(longitude, entry.getValue().getLongitude());
				Instance nearestInstance = nearestNeighbourSearch.nearestNeighbour(tempTweetInst);
				Double clusterId = (Double) mapClusterCentersToClusterId.get(arrayToList(nearestInstance.toDoubleArray()));
				tweetClusterList.get(clusterId.intValue()).addTweetMembers(entry.getKey());
			}
			
			return tweetClusterList;

	}
	
	private static List<Double> arrayToList(double[] array) {
		List<Double> list = new ArrayList<Double>();
		for (double d : array) {
			list.add(d);
		}
		
		return list;
	}
	
}
