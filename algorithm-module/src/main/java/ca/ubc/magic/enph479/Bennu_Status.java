package ca.ubc.magic.enph479;


import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
 
/**
 * @author richardlee@hotmail.ca 
 */
 
public class Bennu_Status {
	
    public static void main(String args[]) throws Exception {
 
        String[] hostList = { "https://bennu.magic.ubc.ca/wotkit/sensors/91539/monitor",
        		"http://richardxlee.com",
        		"http://google.com"};
        String[] nameList = { "Bennu", "Richard", "Google" };
 
        for (int i = 0; i < hostList.length; i++) {
 
            String url = hostList[i];
            String name = nameList[i];
            String status = getStatus(url);
 
            System.out.println(name + "\t\tStatus:" + status);
        }
 
    }
 
    public static String getStatus(String url) throws IOException {
 
        String result = "";
        try {
            URL siteURL = new URL(url);
            HttpURLConnection connection = (HttpURLConnection) siteURL
                    .openConnection();
            connection.setRequestMethod("GET");
            connection.connect();
 
            int code = connection.getResponseCode();
            if (code == 200) {
                result = "Green";
            }
        } catch (Exception e) {
            result = "->Red<-";
        }
        return result;
    }
 
}
