package ca.ubc.magic.enph479.builder;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * TwitterObject is the object that contains all of the structured data of tweets fetched from WoTKit
 * id, timestamp, latitude, longitude, sensor id, sensor name, message, value
 * @author richardlee@hotmail.ca
 *
 */
public class TwitterObject {

	private int id = -1;
	private String timestamp = "undefined";
	private double lat = -1;
	private double lng = -1;
	private int sensor_id = -1;
	private String sensor_name = "undefined";
	private String message = "undefined";
	private int value = -1;
	private int sentimentPolarity = -1;
	private double weatherScore = -1;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(String timestamp) {
		this.timestamp = timestamp;
	}
	public double toEpochTime() {
		
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyy MMM dd HH:mm:ss zzz");
	    Date date = null;
	    if(timestamp == "undefined")
	    	return -1;
	    else{
	    	try {
				date = sdf.parse(timestamp + " UTC");
			} catch (ParseException e) {
				e.printStackTrace();
				return -1;
			}
		    long epoch = date.getTime();
		    
		    return (double) epoch;
	    }
	}
	public double getLatitude() {
		return lat;
	}
	public void setLatitude(double latitude) {
		this.lat = latitude;
	}
	public double getLongitude() {
		return lng;
	}
	public void setLongitude(double longitude) {
		this.lng = longitude;
	}
	public int getSensor_id() {
		return sensor_id;
	}
	public void setSensor_id(int sensor_id) {
		this.sensor_id = sensor_id;
	}
	public String getSensor_name() {
		return sensor_name;
	}
	public void setSensor_name(String sensor_name) {
		this.sensor_name = sensor_name;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public int getValue() {
		return value;
	}
	public void setValue(int value) {
		this.value = value;
	}
	public String printInfo() {
		return "Twitter-id: " + this.id +
				" timestamp: " + this.timestamp +
				" latitude: " + this.lat + 
				" longitude: " + this.lng 
				+ " polarity: " + this.sentimentPolarity;
	}
	
	public int getSentimentPolarity() {
		return sentimentPolarity;
	}
	public void setSentimentPolarity(int sentimentPolarity) {
		this.sentimentPolarity = sentimentPolarity;
	}
	public double getWeatherScore() {
		return weatherScore;
	}
	public void setWeatherScore(double weatherScore) {
		this.weatherScore = weatherScore;
	}	
}
