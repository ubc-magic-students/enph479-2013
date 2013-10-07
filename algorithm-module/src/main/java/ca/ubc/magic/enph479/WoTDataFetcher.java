package ca.ubc.magic.enph479;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;

import weka.core.Instance;

public class WoTDataFetcher {

	private DataManipulationProcessor dmp = null;
	private boolean is_testing = false;
	private int fetch_interval = 0; //in seconds
	private String ref_datetime = null;
	
	public boolean prepareForFetching(boolean _istesting, int _fetch_interval, String _start_time) throws Exception  {
		
		dmp = new DataManipulationProcessor();
		this.is_testing = _istesting;
		this.fetch_interval = _fetch_interval;
		this.ref_datetime = _start_time;
		
		return true;
	}
	
	public void fetchDataExample() throws Exception {
		
		String start_time = dmp.toEpochTime("2013 Sep 29 23:11:04 UTC");
		String end_time = dmp.toEpochTime("2013 Sep 29 23:11:06 UTC");
		
		String jsonstring = dmp.getJsonFromWoT(start_time, end_time);
		ArrayList<TwitterObject> ltwitter = dmp.toListFromJsonParser(jsonstring);
		//ArrayList<Instance> linstance = dmp.PrepareForCluster(ltwitter);
	}
	
	public String fetchData() throws Exception {
		
		//calculate start time and end time from ref_datetime
		Date date_start_time = new Date(ref_datetime);
		Date date_end_time = new Date(ref_datetime);
		
		//set start time fetch interval earlier
		date_start_time.setTime(date_start_time.getTime() - fetch_interval * 1000);
		
		DateFormat date_format = new SimpleDateFormat("yyyy MMM dd HH:mm:ss");
		String start_time = date_format.format(date_start_time);
		String end_time = date_format.format(date_end_time);
		start_time += " UTC";
		end_time += " UTC";
		
		//update ref_date
		Date date_ref_time = new Date(ref_datetime);
		date_ref_time.setTime(date_ref_time.getTime() + fetch_interval * 1000);
		//check if start time is greater than current time
		//if it is, set current time to start time
		Date date_current_time = new Date();
		if(date_ref_time.after(date_current_time)) {
			date_ref_time = date_current_time;
		}
		String ref_time = date_format.format(date_ref_time);
		ref_datetime = ref_time;
		
		//get epoch time
		String epoch_start_time = dmp.toEpochTime(start_time);
		String epoch_end_time = dmp.toEpochTime(end_time);
		
		System.out.println(ref_datetime);
		//retrive from WoT
		String jsonstring = dmp.getJsonFromWoT(epoch_start_time, epoch_end_time);
		ArrayList<TwitterObject> ltwitter = dmp.toListFromJsonParser(jsonstring);
		//ArrayList<Instance> linstance = dmp.toWekaInstanceFromTwitterObj(ltwitter);
		
		
		return "";
	}
	
	
	
}
