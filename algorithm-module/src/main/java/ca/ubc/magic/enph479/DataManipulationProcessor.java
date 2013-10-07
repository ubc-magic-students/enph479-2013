package ca.ubc.magic.enph479;

import java.net.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.io.*;

import weka.core.Attribute;
import weka.core.DenseInstance;
import weka.core.Instance;
import weka.core.Instances;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

public class DataManipulationProcessor {
	
	private boolean is_debug = true;
	private String[] wot_url = new String[] {"http://wotkit.sensetecnic.com/api/sensors/2013enph479.tweets-in-vancouver/data?start=",
			"&end="};
	
	
	public String toEpochTime(String _date) {
		
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyy MMM dd HH:mm:ss zzz");
	    Date date = null;
		try {
			date = sdf.parse(_date);
		} catch (ParseException e) {
			e.printStackTrace();
		}
	    long epoch = date.getTime();
	    
	    return String.valueOf(epoch);
	}
	
	public String getJsonFromWoT(String _startTime, String _endTime) throws Exception {
		
		String url_1 = wot_url[0];
		String url_2 = wot_url[1];
		URL wot_url = new URL(url_1 + _startTime + url_2 + _endTime);
        URLConnection con = wot_url.openConnection();
        BufferedReader breader = new BufferedReader(
                                new InputStreamReader(
                                		con.getInputStream()));
        /*String inputLine;
        while ((inputLine = bReader.readLine()) != null) {
            System.out.println(inputLine);
        }*/
        String json_string = breader.readLine();
        //if(is_debug)
        //	System.out.println(json_string);
        breader.close();
        
        return json_string;
	}
	
	public ArrayList<TwitterObject> toListFromJsonParser(String _jsonstring) {
		
		JsonParser parser = new JsonParser();
        JsonArray jarray = parser.parse(_jsonstring).getAsJsonArray();
        Gson gson = new Gson();
        
        ArrayList<TwitterObject> ltwitter = new ArrayList<TwitterObject>();

        for(JsonElement obj : jarray )
        {
        	TwitterObject tweet = gson.fromJson(obj , TwitterObject.class);
        	ltwitter.add(tweet);
        	if(is_debug)
            	System.out.println(tweet.getInfo());
        }
        
        return ltwitter;
	}
	
	public ArrayList<Instance> toWekaInstanceFromTwitterObj(ArrayList<TwitterObject> _ltwitter) {
		
		ArrayList<Instance> linstance = null;
		Instance inst = new DenseInstance(3);;
		Attribute id = new Attribute("id");
		Attribute timestamp = new Attribute("timestamp");
		Attribute message = new Attribute("message");
		
		ArrayList<Attribute> attribute_list = new ArrayList<Attribute>(2);
		attribute_list.add(id);
        attribute_list.add(timestamp);
        attribute_list.add(message);
        
        Instances data = new Instances("TestInstances",attribute_list,0);
        inst.setDataset(data);
		
		for(int i = 0; i < _ltwitter.size(); i++) {
			//inst = new DenseInstance(3);
			inst.setValue(id, _ltwitter.get(i).getId());
			inst.setValue(timestamp, _ltwitter.get(i).getTimestamp());
			inst.setValue(message, _ltwitter.get(i).getMessage());
			linstance.add(inst);
			
			if(is_debug)
            	System.out.println(inst);
		}
		
		return linstance;
	}

}