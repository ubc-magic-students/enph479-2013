package ca.ubc.magic.enph479;

/**
 * TwitterObject is the object that contains all of the structured data of tweets fetched from WoTKit
 * id, timestamp, latitude, longitude, sensor id, sensor name, message, value
 * @author Richard
 *
 */
public class TwitterObject {

	private int id = -1;
	private String timestamp = "undefined";
	private double latitude = -1;
	private double longitude = -1;
	private int sensor_id = -1;
	private String sensor_name = "undefined";
	private String message = "undefined";
	private int value = -1;
	
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
	public double getLatitude() {
		return latitude;
	}
	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}
	public double getLongitude() {
		return longitude;
	}
	public void setLongitude(double longitude) {
		this.longitude = longitude;
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
				" latitude: " + this.latitude + 
				" longitude: " + this.longitude;
	}	
}
