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
import ca.ubc.magic.enph479.builder.TwitterObject;
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
	 * @param maxK number of clusters
	 * @return A list of TweetCluster objects
	 * @throws Exception
	 */
	public ArrayList<TweetCluster> cluster(ArrayList<TweetInstance> newTweets, HashMap<Integer, TwitterObject> allTweets, int maxK) throws Exception {
		//TODO: we may not need this if check anymore.
		if (newTweets.size() == 0)
			return tweetClusterList;
		
		for (TweetInstance inst : newTweets) {
			clusterer.trainOnInstanceImpl(inst);
		}
		Clustering microC = clusterer.getMicroClusteringResult();
		
		double maxCalinskiHarabaszIndex = 0.0;
		
		//Choose k random micro clusters as initial centers.
		if (maxK > microC.size())
			maxK = microC.size();
		
		HashMap<Double, ArrayList<TweetCluster>> indexMap = new HashMap<Double, ArrayList<TweetCluster>>();
		for (int k = 1; k <= maxK; k++) {
			
			Clustering randomClustering = new Clustering();
			UniqueRandomNumberGenerator random = new UniqueRandomNumberGenerator(k);
			for(int i = 0; i < k ; i++) {
				randomClustering.add(microC.get(random.nextInt()));
			}
		
			Clustering clustering = moa.clusterers.KMeans.gaussianMeans(randomClustering, microC);
		
			for (int i = 0; i < clustering.getClustering().size(); i++) {
				clustering.getClustering().get(i).setId(i);
			}
		
			tweetClusterList = nearestNeighbour(clustering, allTweets);
			
			double indexMultiplier;
			if (k == 1 || k == allTweets.size())
				indexMultiplier = 1;
			else
				indexMultiplier = (allTweets.size()-k)/(double)(k-1);
				
			double tempIndex = indexMultiplier * getSumInterClusterDistance(tweetClusterList, allTweets)/getSumIntraClusterDistance(tweetClusterList, allTweets);
			
			System.err.println(tempIndex);
			indexMap.put(tempIndex, tweetClusterList);
			if (tempIndex > maxCalinskiHarabaszIndex)
				maxCalinskiHarabaszIndex = tempIndex;
		}
			
		return indexMap.get(maxCalinskiHarabaszIndex);
		
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
	
	private static double distanceSqr(double[] pointA, double [] pointB){
        double distance = 0.0;
        for (int i = 0; i < pointA.length; i++) {
            double d = pointA[i] - pointB[i];
            distance += d * d;
        }
        return distance;
    }
	
	private static double getSumInterClusterDistance(ArrayList<TweetCluster> tweetClusterList, HashMap<Integer, TwitterObject> tweetObjectMap) {
		double sumLat = 0.0;
		double sumLong = 0.0;
		
		for (Map.Entry<Integer, TwitterObject> entry : tweetObjectMap.entrySet()) {
			sumLat += entry.getValue().getLatitude();
			sumLong += entry.getValue().getLongitude();
		}
		
		double[] mean = new double[] {sumLat/tweetObjectMap.size(), sumLong/tweetObjectMap.size()};
		
		double sum = 0.0;
		for (TweetCluster c : tweetClusterList) {
			sum += c.getTweetIds().size() * distanceSqr(c.getCluster().getCenter(), mean);
		}
		
		return sum;
	}
	
	private static double getSumIntraClusterDistance(ArrayList<TweetCluster> tweetClusterList, HashMap<Integer, TwitterObject> tweetObjectMap) {
		double sum = 0.0;
		for (TweetCluster c : tweetClusterList) {
			for (int i : c.getTweetIds()) {
				double[] tweetLatLong = new double[] {tweetObjectMap.get(i).getLatitude(), tweetObjectMap.get(i).getLongitude()};
				sum += distanceSqr(c.getCluster().getCenter(), tweetLatLong);
			}
		}
		
		return sum;
	}
	
}
