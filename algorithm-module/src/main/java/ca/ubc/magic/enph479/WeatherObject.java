package ca.ubc.magic.enph479;

/**
 * WeatherObject is the object that contains all of the structured data of weathers fetched from WeatherAPI
 * weather, temp
 * @author Richard
 *
 */
public class WeatherObject {

	private String weather = "undefined";
	private String description = "undefined";
	private double temperature = -1;
	private double pressure = -1;
	
	
	public String getWeather() {
		return weather;
	}
	public void setWeather(String weather) {
		this.weather = weather;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public double getTemperature() {
		return temperature;
	}
	public void setTemperature(double temp) {
		this.temperature = temp;
	}
	public double getPressure() {
		return pressure;
	}
	public void setPressure(double pressure) {
		this.pressure = pressure;
	}
	public String printInfo() {
		return "forecase: " + this.getWeather() +
				", description: " + this.getDescription() + 
				", temperature: " + this.getTemperature() +
				", pressure: " + this.getPressure();
	}	
}
