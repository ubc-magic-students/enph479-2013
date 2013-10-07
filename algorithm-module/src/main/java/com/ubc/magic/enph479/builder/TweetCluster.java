package com.ubc.magic.enph479.builder;

import java.util.ArrayList;

import moa.cluster.Cluster;
import moa.cluster.SphereCluster;

public class TweetCluster {

	private static final long serialVersionUID = 1L;
	private ArrayList<Integer> tweetIds = new ArrayList<Integer>();
	private Cluster cluster = null; 
	
	public TweetCluster(Cluster cluster) {
		this.cluster = cluster;
	}
	
	public ArrayList<Integer> getTweetIds() {
		return tweetIds;
	}
	
	public boolean addTweetMembers(int tweetId) {
		if (tweetIds.add(tweetId))
			return true;
		return false;
	}
	
	public SphereCluster getCluster() {
		return (SphereCluster)cluster;
	}
	
	
}
