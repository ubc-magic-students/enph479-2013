package ca.ubc.magic.enph479;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import moa.cluster.SphereCluster;
import moa.clusterers.CobWeb;
import weka.core.Attribute;
import weka.core.Instance;
import weka.core.Instances;
import ca.ubc.magic.enph479.builder.TweetCluster;
import ca.ubc.magic.enph479.builder.TweetInstance;
import ca.ubc.magic.enph479.builder.TwitterObject;

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
	private double CUTOFF = 0.002;
	
	/**
	 * The minimal standard deviation of a cluster attribute.
	 */
	private double ACUITY = 0.01;
	
	/**
	 * Number of dimensions to cluster.
	 */
	private int numAttributes = 2;
	
	public TweetClusterer() {
		clusterer.prepareForUse();
		clusterer.setCutoff(CUTOFF);
		clusterer.setAcuity(ACUITY);
	}
	
	public TweetClusterer(int numAttributes) {
		this();
		this.numAttributes = numAttributes;
	}
	
	public TweetClusterer(double acuity, double cutoff) {
		clusterer.prepareForUse();
		clusterer.setCutoff(cutoff);
		clusterer.setAcuity(acuity);
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
		
		for (Map.Entry<Integer, TwitterObject> entry : allTweets.entrySet()) {
			TweetInstance tempTweetInst = entry.getValue().toTweetInstance(numAttributes);
			
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
	    	SphereCluster c = new SphereCluster(entry.getValue(), numAttributes);
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
		clusterer.trainOnInstance(newTweets);
		
	}
	
	private static int returnIndex(double[] vote) {
		for (int i = 0; i < vote.length; i++) {
			if (vote[i] == 1)
				return i;
		}
		
		return -1;
		
	}
	
}
