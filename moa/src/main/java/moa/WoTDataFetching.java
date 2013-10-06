package moa;

import java.net.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.io.*;

public class WoTDataFetching {
	
	public static void main(String[] args) throws Exception {
		
		String startTime = ToEpochTime("2013 Sep 29 23:10:00 UTC");
		String endTime = ToEpochTime("2013 Sep 29 23:20:00 UTC");
		
		URL WoTurl = new URL("http://wotkit.sensetecnic.com/api/sensors/2013enph479.tweets-in-vancouver/data?start="
				+ startTime + "&end=" + endTime);
        URLConnection con = WoTurl.openConnection();
        BufferedReader bReader = new BufferedReader(
                                new InputStreamReader(
                                		con.getInputStream()));
        String inputLine;
        while ((inputLine = bReader.readLine()) != null) {
            System.out.println(inputLine);
        }
        bReader.close();
 
	}
	
	private static String ToEpochTime(String _date) {
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyy MMM dd HH:mm:ss zzz");
	    Date date = null;
		try {
			date = sdf.parse(_date);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	    long epoch = date.getTime();
	    return String.valueOf(epoch);
	}

}
