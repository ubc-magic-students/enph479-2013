package ca.ubc.magic.enph479;

import java.io.BufferedReader;
import java.io.InputStreamReader;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;

import org.apache.http.HttpException;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;

/**
 * A class to fetch tweet sentiment from Sentiment140. Currently the appid is set to chris.yoon90@gmail.com.
 * In the future, The user should change the appid to his own. For more information visit http://www.sentiment140.com/.
 * 
 * @author chris.yoon90@gmail.com
 *
 */
public class TweetSentimentFetcher {
	
	public static final String APPID = "chris.yoon90@gmail.com";
	public static final String URL = "http://www.sentiment140.com/api/bulkClassifyJson?appid=" + APPID;
	
	/**
	 * HttpPost request to Sentiment140 API to obtain sentiment polarity.
	 * 
	 * @param text text to analyze
	 * @return Sentiment polarity scale from 0 to 4, 4 being the most positive score.
	 * @throws Exception
	 */
	public static int doPost(String text) throws Exception {
		try {
		HttpClient client = HttpClientBuilder.create().build();
		HttpPost post = new HttpPost(URL);
		JSONArray array = new JSONArray();
		array.add(new JSONObject().accumulate("text", text));
		JSONObject parentObject = new JSONObject().accumulate("data", array);
		
		StringEntity params =new StringEntity(parentObject.toString(),  ContentType.create("application/json"));
		post.setEntity(params);
		
		HttpResponse response = client.execute(post);
		
		if (response.getStatusLine().getStatusCode() != 200)
			throw new HttpException("Status code is not 200");
		
		BufferedReader rd = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
		String line = "";
		StringBuffer lineBuffer = new StringBuffer();
		while ((line = rd.readLine()) != null) {
			lineBuffer.append(line);
		}
		
		JSONObject json = (JSONObject) JSONSerializer.toJSON(lineBuffer.toString());
		return ((JSONObject)json.getJSONArray("data").get(0)).getInt("polarity");
		} catch(Exception e) {
			e.printStackTrace();
			throw e;
		}
	}
	
}
