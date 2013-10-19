package ca.ubc.magic.enph479;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import moa.cluster.Cluster;
import moa.cluster.Clustering;
import moa.cluster.SphereCluster;
import moa.clusterers.AbstractClusterer;
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

/**
 * Class for clustering tweet instances.
 * 
 * @author chris.yoon90@gmail.com
 *
 */
public class TweetClusterer {
	
	private CobWeb clusterer = new CobWeb();
	private ArrayList<TweetCluster> tweetClusterList = new ArrayList<TweetCluster>();
	
	/**
	 * The minimum increase of category utility to add a new node to the hierarchy.
	 */
	private final double CUTOFF = 0.002;
	
	/**
	 * The minimal standard deviation of a cluster attribute.
	 */
	private final double ACUITY = 0.01;
	
	public TweetClusterer() {
		clusterer.prepareForUse();
		clusterer.setCutoff(CUTOFF);
		clusterer.setAcuity(ACUITY);
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
		
		final int numAtts = newTweets.get(0).numAttributes();
		
		ArrayList<Attribute> atts = new ArrayList<Attribute>(numAtts);
		for (int i=0; i< numAtts; i++) {
			atts.add(new Attribute("att"+i));
		}

		for (TweetInstance inst : newTweets) {
			Instances referenceInstances = new Instances("Dataset" + inst.getId(), atts , 0);
	    	inst.setDataset(referenceInstances);
			clusterer.trainOnInstance(inst);
		}
		
		HashMap<Integer, ArrayList<TweetInstance>> map = new HashMap<Integer, ArrayList<TweetInstance>>();
		
		for (Map.Entry<Integer, TwitterObject> entry : allTweets.entrySet()) {
			TweetInstance tempTweetInst = new TweetInstance(numAtts, entry.getValue().getId());
			//TODO: figure out how to make this work with more than two attributes
			tempTweetInst.setValue(new Attribute("latitude", 0), entry.getValue().getLatitude());
			tempTweetInst.setValue(new Attribute("longitude", 1), entry.getValue().getLongitude());
			tempTweetInst.setDataset(new Instances("Dataset" + tempTweetInst.getId(), atts , 0));
			
			int index = returnIndex(clusterer.getVotesForInstance(tempTweetInst));
			
	    	if (index == -1)
	    		continue;
	    	
	    	if (map.containsKey(index)) {
	    		map.get(index).add(tempTweetInst);
	    	} else {
	    		ArrayList<TweetInstance> temp = new ArrayList<TweetInstance>();
	    		temp.add(tempTweetInst);
	    		map.put(index, temp);
	    	}
		}

		ArrayList<TweetCluster> tempClusterList = new ArrayList<TweetCluster>();
		double clusterId = 0.0;
	    for (Map.Entry<Integer, ArrayList<TweetInstance>> entry : map.entrySet()) {
	    	SphereCluster c = new SphereCluster(entry.getValue(), numAtts);
	    	c.setId(clusterId++);
	    	TweetCluster tc = new TweetCluster(c);
	    	for (Instance i : entry.getValue()) {
	    		tc.addTweetMembers(((TweetInstance) i).getId());
	    	}
	    	tempClusterList.add(tc);
	    }
	    
	    System.out.println(clusterer.graph());
	    System.out.println("Number of Clusters: " + tempClusterList.size());
	    
	    tweetClusterList = tempClusterList;
		
		return tweetClusterList;
		
	}
	
	private static int returnIndex(double[] vote) {
		for (int i = 0; i < vote.length; i++) {
			if (vote[i] == 1)
				return i;
		}
		
		return -1;
		
	}
	
}
