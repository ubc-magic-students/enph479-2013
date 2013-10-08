package ca.ubc.magic.enph479;

/**
 * WeatherObject is the object that contains all of the structured data of weather fetched from WoTKit
 * timestamp, message
 * @author Richard
 *
 */
public class WeatherObject {

	private String timestamp = "undefined";
	private String message = "undefined";
	
	public String getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(String timestamp) {
		this.timestamp = timestamp;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String printInfo() {
		return "Weather-timestamp: " + this.timestamp +
				" message: " + this.message;
	}	
}
