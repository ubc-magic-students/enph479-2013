package ca.ubc.magic.enph479.builder;

/**
 * WeatherObject is the object that contains all of the structured data of weathers fetched from WeatherAPI
 * weather, temp
 * @author richardlee@hotmail.ca
 *
 */
public class WeatherObject {

	private int id = -1;
	private String weather = "undefined";
	private String description = "undefined";
	private double temperature = -1;
	private double pressure = -1;
	private double precipitation = 0;
	private String icon = "undefined";
	
	private double temp_weight = 0.5;
	private double prec_weight = 0.5;
	
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
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
	public String getIcon() {
		return icon;
	}
	public void setIcon(String icon) {
		this.icon = icon;
	}
	public String printInfo() {
		return "forecase: " + this.getWeather() +
				", description: " + this.getDescription() + 
				", temperature: " + this.getTemperature() +
				", pressure: " + this.getPressure();
	}
	public double getPrecipitation() {
		return precipitation;
	}
	public void setPrecipitation(double precipitation) {
		this.precipitation = precipitation;
	}
	public double getWeatherScore() {
		return (double) (temp_weight * this.temperature + prec_weight * this.precipitation);
	}
}
