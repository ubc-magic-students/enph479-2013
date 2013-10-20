package ca.ubc.magic.enph479;

import ca.ubc.magic.enph479.DataManipulationProcessor.web_type;
import ca.ubc.magic.enph479.builder.WeatherObject;

public class Weather_Testing {
	
	public static void main(String[] args) throws Exception {
		
		DataManipulationProcessor dmp = new DataManipulationProcessor();
		double _lat = 49.270582970484085;
		double _lng = -123.13069438143295;
		
		dmp.getJsonFromWeb(web_type.weather, _lat, _lng);
		WeatherObject weather_condition = dmp.toWeatherFromJsonParser(web_type.weather);
		System.out.println(weather_condition.getDescription());
	}

}
