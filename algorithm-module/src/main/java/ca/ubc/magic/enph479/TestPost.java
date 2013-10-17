package ca.ubc.magic.enph479;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;

public class TestPost {

	public static void main(String[] args) throws ClientProtocolException, IOException {
		String url = "http://www.sentiment140.com/api/bulkClassifyJson?appid=chris.yoon90@gmail.com";
		
		HttpClient client = new DefaultHttpClient();
		HttpPost post = new HttpPost(url);
		
		//List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
		//urlParameters.add(new BasicNameValuePair("appid", "chris.yoon90@gmail.com"));
		StringEntity params =new StringEntity("{\"data\": [{\"text\": \"I love Titanic.\"}]}",  ContentType.create("application/json"));
		post.setEntity(params);
		
		HttpResponse response =client.execute(post);
		System.out.println(response.getStatusLine().getStatusCode());
		BufferedReader rd = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
		String line ="";
		while ((line = rd.readLine()) != null) {
			System.out.println(line);
		}

	}

}
