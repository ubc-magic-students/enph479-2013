package ca.ubc.magic.enph479;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class WDF_Driver {

	public static void main(String[] args) throws Exception {
		
		WoTDataFetcher wdf = new WoTDataFetcher();
		
		String start_datetime = "2013 Sep 29 23:11:00";
		
		/*
		Date date_now = new Date();
		DateFormat date_format = new SimpleDateFormat("yyyy MMM dd HH:mm:ss");
		String start_datetime = date_format.format(date_now);
		start_datetime += " UTC";
		*/
		
		if(!wdf.prepareForFetching(false, 1, start_datetime)) {
			System.out.println("Error while initializing WotDataFetcher...");
			return;
		}
		
		//wdf.fetchDataExample();
		for(int i = 0; i < 10; i++) {
			wdf.fetchData();
		}
		
		
	}
}
