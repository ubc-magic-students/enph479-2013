package ca.ubc.magic.enph479;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import moa.cluster.Cluster;
import moa.cluster.Clustering;
import moa.cluster.SphereCluster;
import moa.clusterers.CobWeb;
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

@Deprecated
/**
 * Class for clustering tweet instances.
 * 
 * @author chris.yoon90@gmail.com
 *
 */
public class TweetClusterer {
	
	private CobWeb cobwebClusterer = new CobWeb();
	private ClusTree trueClusterer = new ClusTree();
	private ArrayList<TweetCluster> tweetClusterList = new ArrayList<TweetCluster>();
	
	/**
	 * The minimum increase of category utility to add a new node to the hierarchy.
	 */
	private double CUTOFF = 0.08;
	
	/**
	 * The minimal standard deviation of a cluster attribute.
	 */
	private double ACUITY = 0.009;
	
	/**
	 * Number of dimensions to cluster.
	 */
	private int numAttributes = 2;
	
	public TweetClusterer() {
		cobwebClusterer.prepareForUse();
		trueClusterer.prepareForUse();
		cobwebClusterer.setCutoff(CUTOFF);
		cobwebClusterer.setAcuity(ACUITY);
	}
	
	public TweetClusterer(int numAttributes) {
		this();
		this.numAttributes = numAttributes;
	}
	
	public TweetClusterer(double acuity, double cutoff) {
		cobwebClusterer.prepareForUse();
		trueClusterer.prepareForUse();
		cobwebClusterer.setCutoff(cutoff);
		cobwebClusterer.setAcuity(acuity);
	}
	
	public TweetClusterer(double acuity, double cutoff, int numAttributes) {
		this(acuity, cutoff);
		this.numAttributes = numAttributes;
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
	public ArrayList<TweetCluster> cluster(ArrayList<TweetInstance> newTweets, HashMap<Integer, TwitterObject> allTweets) throws Exception {
		if (newTweets.size() == 0)
			return tweetClusterList;
		
		for (TweetInstance inst : newTweets)
			trainClusterer(inst);

		HashMap<Integer, ArrayList<TweetInstance>> map = new HashMap<Integer, ArrayList<TweetInstance>>();
		Set<Integer> numLeafs = new LinkedHashSet<Integer>();
		
		for (Map.Entry<Integer, TwitterObject> entry : allTweets.entrySet()) {
			TweetInstance tempTweetInst = entry.getValue().toTweetInstance(numAttributes);
			
			int index = returnIndex(cobwebClusterer.getVotesForInstance(tempTweetInst));
			
	    	if (index == -1)
	    		continue;
	    	
	    	if (map.containsKey(index)) {
	    		numLeafs.add(index);
	    		map.get(index).add(tempTweetInst);
	    	} else {
	    		ArrayList<TweetInstance> temp = new ArrayList<TweetInstance>();
	    		temp.add(tempTweetInst);
	    		map.put(index, temp);
	    	}
		}
		
		int numClusters = map.size();
		Clustering microC = trueClusterer.getMicroClusteringResult();
		Clustering randomClustering = new Clustering();
        UniqueRandomNumberGenerator random = new UniqueRandomNumberGenerator(numClusters);
        for(int i = 0; i < numClusters ; i++) {
        	randomClustering.add(microC.get(random.nextInt()));
        }
        
        Clustering clustering = moa.clusterers.KMeans.gaussianMeans(randomClustering, microC);
        System.out.println("Num Clusters: " + clustering.getClustering().size());
        
        for (int i = 0; i < clustering.getClustering().size(); i++) {
            clustering.getClustering().get(i).setId(i);
            /*for (double d: clustering.getClustering().get(i).getCenter())
            	System.out.print(d + ", ");
            System.out.println();*/
        }
         
		/*ArrayList<TweetCluster> tempClusterList = new ArrayList<TweetCluster>();
		double clusterId = 0.0;
	    for (Map.Entry<Integer, ArrayList<TweetInstance>> entry : map.entrySet()) {
	    	SphereCluster c = new SphereCluster(entry.getValue(), numAttributes);
	    	c.setId(clusterId++);
	    	TweetCluster tc = new TweetCluster(c);
	    	for (Instance i : entry.getValue()) {
	    		tc.addTweetMembers(((TweetInstance) i).getId());
	    	}
	    	tempClusterList.add(tc);
	    }
	    
	    System.out.println(cobwebClusterer.graph());
	    System.out.println("Number of Clusters: " + tempClusterList.size());
	    
	    tweetClusterList = tempClusterList;*/
        
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

         ArrayList<Attribute> atts = new ArrayList<Attribute>(numAttributes);
         for (int i = 0; i < numAttributes; i++) {
        	 atts.add(new Attribute("att"+i));
         }
         
         Instances centerInstances = new Instances("ClusterCenterInstances", atts , 0);
         for (int i = 0; i < numberOfClusters; i++) {
        	 Instance tempInst = new DenseInstance(numAttributes);
        	 for (int j = 0; j < atts.size(); j++) {
        		 tempInst.setValue(atts.get(j), clustering.getClustering().get(i).getCenter()[j]);
        	 }
        	 centerInstances.add(tempInst);
         }
         
         NearestNeighbourSearch nearestNeighbourSearch = new BallTree();
         nearestNeighbourSearch.setInstances(centerInstances);
         
         for (Map.Entry<Integer, TwitterObject> entry : tweetInstanceMap.entrySet()) {
                 Instance tempTweetInst = entry.getValue().toTweetInstance(numAttributes);
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
	
	/**
	 * A method to train the clusterer with newTweets
	 * 
	 * @param newTweets
	 */
	public void trainClusterer(TweetInstance newTweets) {	
		if (newTweets == null)
			return;
		
		int numAtts = newTweets.numAttributes();
		
		ArrayList<Attribute> atts = new ArrayList<Attribute>(numAtts);
		for (int i=0; i< numAtts; i++) {
			atts.add(new Attribute("att"+i));
		}
		
		Instances referenceInstances = new Instances("Dataset" + newTweets.getId(), atts , 0);
	    newTweets.setDataset(referenceInstances);
		cobwebClusterer.trainOnInstance(newTweets);
		trueClusterer.trainOnInstance(newTweets);
		
	}
	
	private static int returnIndex(double[] vote) {
		for (int i = 0; i < vote.length; i++) {
			if (vote[i] == 1)
				return i;
		}
		
		return -1;
		
	}
	
}
