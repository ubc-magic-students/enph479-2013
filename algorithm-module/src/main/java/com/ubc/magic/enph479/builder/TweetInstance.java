package com.ubc.magic.enph479.builder;

import weka.core.DenseInstance;
import weka.core.Instance;

public class TweetInstance extends DenseInstance{
	
	private static final long serialVersionUID = 1L;
	private int id;
	private double clusterId;
	
	public TweetInstance(double weight, double[] attValues, int id) {
		super(weight, attValues);
		this.id = id;
	}
	
	public TweetInstance(Instance instance, int id) {
		super(instance);
		this.id = id;
	}

	public TweetInstance(int numAttributes, int id) {
		super(numAttributes);
		this.id = id;
	}

	public int getId() {
		return id;
	}
	
	public void setClusterId(double id) {
		this.clusterId = id;
	}
	
	public double getClusterId() {
		return clusterId;
	}

}
