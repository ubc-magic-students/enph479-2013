package com.ubc.magic.enph479.builder;

import java.util.ArrayList;

import moa.cluster.Clustering;

import weka.clusterers.ClusterEvaluation;
import weka.clusterers.EM;
import weka.core.Attribute;
import weka.core.DenseInstance;
import weka.core.Instances;

public class LocationClusterer {
	
	private double[][] means = null;
	private double[][] stdDevs = null;
	private double[][] weightSum = null;
	
	public double[][] getMeans() {
		return means;
	}
	
	public double[][] getStdDevs() {
		return stdDevs;
	}
	
	public double[][] getWeightSum() {
		return weightSum;
	}
	
	public LocationClusterer cluster(Clustering microClusters) throws Exception {
		try {
			int numberOfClusters = microClusters.getClustering().size();
			
			ArrayList<Attribute> atts = new ArrayList<Attribute>(2);
			atts.add(new Attribute("latitude"));
			atts.add(new Attribute("logitude"));
			Instances clusterInstances = new Instances("ClusterCenterInstances", atts , 0);
			
			for (int i = 0; i < numberOfClusters; i++) {
				clusterInstances.add(new DenseInstance(1, microClusters.getClustering().get(i).getCenter()));
			}
			
			EM cw = new EM();
			String[] options = {"-N", "15", "-I", "100"};
			cw.setOptions(options);
			cw.buildClusterer(clusterInstances);
			ClusterEvaluation eval = new ClusterEvaluation();
		    eval.setClusterer(cw);
		    eval.evaluateClusterer(new Instances(clusterInstances));
		    
		    int numClusters = cw.getNumClusters();
		    int numAttributes = cw.getClusterModelsNumericAtts()[0].length;
		    means = new double[numClusters][numAttributes];
		    stdDevs = new double[numClusters][numAttributes];
		    weightSum = new double[numClusters][numAttributes];
		    
		    for(int i = 0; i < numClusters; i++) {
		    	
		    }
		    
		    return this;
			
		} catch (Exception e) {
			throw e;
		}
	}
	
}
