package ca.ubc.magic.enph479.builder;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import weka.core.Attribute;
import weka.core.Instances;

/**
 * RegionObject is the object that contains all of the informations about regions of Vancouver
 * @author richardlee@hotmail.ca
 *
 */
public class RegionObject {

	class regionX {
		private double lat_min = -1;
		private double lat_max = -1;
		private double lng_min = -1;
		private double lng_max = -1;
		private eRegion reg;
		
		private regionX(double _lat_min, double _lat_max, double _lng_min, double _lng_max, eRegion _r) {
			this.lat_min = _lat_min;
			this.lat_max = _lat_max;
			this.lng_min = _lng_min;
			this.lng_max = _lng_max;
			this.reg = _r;
		}
		
		private boolean isThisRegion(double _lat, double _lng) {
			if((_lat >= this.lat_min)&&(_lat <= this.lat_max)
				&&(_lng>=this.lng_min)&&(_lng<=this.lng_max)) {
				return true;
			}
			
			return false;
		}
	}
	
	private enum eRegion {
		Vancouver(-1), WestVancouver(0), CentralVancouver(1), EastVancouver(2);
		
		int regionIndex;
		eRegion(int _index) {
	        this.regionIndex = _index;
	    }
	}
	
	private double vancouver_lat_min = 49.195;
	private double vancouver_lat_max = 49.315;
	private double vancouver_lng_min = -123.270;
	private double vancouver_lng_max = -123.020;
	
	private double region1_lat_min = vancouver_lat_min;
	private double region1_lat_max = vancouver_lat_max;
	private double region1_lng_min = vancouver_lng_min;
	private double region1_lng_max = -123.16772;
	
	private double region2_lat_min = vancouver_lat_min;
	private double region2_lat_max = vancouver_lat_max;
	private double region2_lng_min = -123.16772;
	private double region2_lng_max = -123.05717;
	
	private double region3_lat_min = vancouver_lat_min;
	private double region3_lat_max = vancouver_lat_max;
	private double region3_lng_min = -123.05717;
	private double region3_lng_max = vancouver_lng_max;
	
	private int regionCount = 3;
	
	private regionX regionVancouver = new regionX(vancouver_lat_min, vancouver_lat_max, vancouver_lng_min, vancouver_lng_max, eRegion.Vancouver);
	private regionX region1 = new regionX(region1_lat_min, region1_lat_max, region1_lng_min, region1_lng_max, eRegion.WestVancouver);
	private regionX region2 = new regionX(region2_lat_min, region2_lat_max, region2_lng_min, region2_lng_max, eRegion.CentralVancouver);
	private regionX region3 = new regionX(region3_lat_min, region3_lat_max, region3_lng_min, region3_lng_max, eRegion.EastVancouver);
	
	public int getRegionCount() {
		return this.regionCount;
	}
	
	public boolean isVancouver(double _lat, double _lng) {
		if(regionVancouver.isThisRegion(_lat, _lng))
			return true;
		
		return false;
	}
	
	public int classifyIntoRegion(double _lat, double _lng) {
		if(region1.isThisRegion(_lat, _lng))
			return region1.reg.regionIndex;
		else if(region2.isThisRegion(_lat, _lng))
			return region2.reg.regionIndex;
		else if(region3.isThisRegion(_lat, _lng))
			return region3.reg.regionIndex;
		else
			return -1;
	}
	
}
