package moa;

import weka.core.DenseInstance;
import weka.core.Instance;
import moa.cluster.Cluster;
import moa.cluster.Clustering;
import moa.cluster.SphereCluster;
import moa.clusterers.AbstractClusterer;
import moa.clusterers.ClusterGenerator;
import moa.clusterers.clustree.ClusTree;
import moa.gui.visualization.DataPoint;
import moa.streams.clustering.RandomRBFGeneratorEvents;
import moa.streams.generators.RandomRBFGenerator;

public class ClusterExample {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		
		int totalInstances = 10;
		
		//RandomRBFGeneratorEvents stream = new RandomRBFGeneratorEvents();
		CustomGenerator stream = new CustomGenerator();
		AbstractClusterer clusterer = new ClusTree();
		stream.prepareForUse();
		clusterer.prepareForUse();
		int m_timestamp = 0;
		
		Clustering clustering0 = null;
		
		while(m_timestamp < totalInstances && stream.hasMoreInstances()){
			m_timestamp++;
			Instance next = stream.nextInstance();
			DataPoint point0 = new DataPoint(next,m_timestamp);
			Instance traininst0 = new DenseInstance(point0);
			if(clusterer instanceof ClusterGenerator)
				traininst0.setDataset(point0.dataset());
			else
				traininst0.deleteAttributeAt(point0.classIndex());
	
			clusterer.trainOnInstanceImpl(traininst0);
			//Clustering gtClustering0 = ((RandomRBFGeneratorEvents)stream).getMicroClustering();
			Clustering gtClustering0 = ((CustomGenerator)stream).getMicroClustering();
			Clustering microC = clusterer.getMicroClusteringResult();
			clustering0 = moa.clusterers.KMeans.gaussianMeans(gtClustering0, microC);
			
		}
		
		//print each cluster centers
		for (int i = 0; i < clustering0.getClustering().size(); i++) {
			Cluster c = clustering0.getClustering().get(i);
			c.setId(i);
			//double[] center = c.getCenter();
			//System.err.println("ID " + c.getId() + ": " + center[0] + ", " + center[1] + ", Radius: " + ((SphereCluster) c).getRadius() );
			System.out.println(c.getInfo());
		}
		

	}

}