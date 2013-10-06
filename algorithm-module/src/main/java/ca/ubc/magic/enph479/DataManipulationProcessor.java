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

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

public class DataManipulationProcessor {
	
	private boolean _isDebug = true;
	
	
	public String ToEpochTime(String _date) {
		
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
	
	public String GetJsonFromWoT(String _startTime, String _endTime) throws Exception {
		
		URL WoTurl = new URL("http://wotkit.sensetecnic.com/api/sensors/2013enph479.tweets-in-vancouver/data?start="
				+ _startTime + "&end=" + _endTime);
        URLConnection con = WoTurl.openConnection();
        BufferedReader bReader = new BufferedReader(
                                new InputStreamReader(
                                		con.getInputStream()));
        /*String inputLine;
        while ((inputLine = bReader.readLine()) != null) {
            System.out.println(inputLine);
        }*/
        String jsonString = bReader.readLine();
        if(_isDebug)
        	System.out.println(jsonString);
        bReader.close();
        
        return jsonString;
	}
	
	public ArrayList<TwitterObject> JsonParserToList(String jsonString) {
		
		JsonParser parser = new JsonParser();
        JsonArray Jarray = parser.parse(jsonString).getAsJsonArray();
        Gson gson = new Gson();
        
        ArrayList<TwitterObject> lTwitter = new ArrayList<TwitterObject>();

        for(JsonElement obj : Jarray )
        {
        	TwitterObject tweet = gson.fromJson(obj , TwitterObject.class);
        	lTwitter.add(tweet);
        	if(_isDebug)
            	System.out.println(tweet.getInfo());
        }
        
        return lTwitter;
	}
	
	public ArrayList<Instance> PrepareForCluster(ArrayList<TwitterObject> lTwitter) {
		
		ArrayList<Instance> lInstance = null;
		Instance inst;
		Attribute id = new Attribute("id");
		Attribute timestamp = new Attribute("timestamp");
		Attribute message = new Attribute("message");
		for(int i = 0; i < lTwitter.size(); i++) {
			inst = new DenseInstance(3);
			inst.setValue(id, lTwitter.get(i).getId());
			inst.setValue(timestamp, lTwitter.get(i).getTimestamp());
			inst.setValue(message, lTwitter.get(i).getMessage());
			lInstance.add(inst);
			
			if(_isDebug)
            	System.out.println(inst);
		}
		
		return lInstance;
	}

}