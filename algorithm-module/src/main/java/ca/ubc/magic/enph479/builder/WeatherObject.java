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
	private double temperature = -999;
	private double pressure = -999;
	private double precipitation = -999;
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
		if((this.temperature==-999)&&(this.precipitation==-999)){
			return (double) -999;
		}
		if((this.temperature!=-999)&&(this.precipitation==-999)) {
			this.precipitation = 0.0;
		}
		// happiness function for temperature
		double temperature_happiness = 10*Math.exp(-Math.pow(this.temperature-21, 2)/150);
		// happiness function for precipitation
		double precipitation_happiness = 10*Math.exp(-1/5 * this.precipitation);
		
		return (double) (temp_weight * temperature_happiness + prec_weight * precipitation_happiness);
	}
}
