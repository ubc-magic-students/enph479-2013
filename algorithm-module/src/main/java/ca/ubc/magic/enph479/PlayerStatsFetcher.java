package ca.ubc.magic.enph479;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;
import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.Node;
import org.dom4j.XPath;
import org.dom4j.io.SAXReader;
import org.dom4j.xpath.DefaultXPath;
import org.jaxen.SimpleNamespaceContext;

/**
 * Class to fetch NHL player statistics. For more info, please visit: http://developer.sportsdatallc.com/docs/read/NHL_API
 * 
 * @author chris.yoon90@gmail.com
 *
 */
public class PlayerStatsFetcher {
	
	private static final String APIKEY = "ejrs3nexcrsf2z6s84darvbp";
	private static final String BASEURL = "http://api.sportsdatallc.org/nhl-t3";
	private static Properties property = new Properties();
	
	public PlayerStatsFetcher() throws Exception {
		try(InputStream fileInput = getClass().getResourceAsStream("/player_ids.properties")) {
			property.load(fileInput);
		}
	}
	
	public double[] getPlayerStats(String full_name) {
		// Goals and assists
		return new double[] {0, 0};
	}
	
	public double[] getGoalieStats(String full_name) throws Exception {
		// Goals allowed average
		//save percentage
		//wins
		String[] temp = full_name.split(" ");
		String playerId = property.getProperty(temp[0] + "_" + temp[1]);
		if (playerId == null)
			return null;
		
		String url = BASEURL + "/players/" + playerId + "/profile.xml?api_key=" + APIKEY;
		HttpClient client = HttpClientBuilder.create().build();
		HttpGet get = new HttpGet(url);
		HttpResponse response = client.execute(get);
		
		if (response.getStatusLine().getStatusCode() != 200)
			return null;
		
		SAXReader reader = new SAXReader();
		Document document = reader.read(response.getEntity().getContent());
		Element e = (Element) document.getRootElement();
		
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("playerNamespace", e.getNamespace().getStringValue());
		
		XPath xpath = new DefaultXPath("//playerNamespace:goaltending");
		xpath.setNamespaceContext(new SimpleNamespaceContext(map));
		
		Element node = (Element) xpath.selectSingleNode(document);
		System.out.println(node.element("total").valueOf("@games_played"));
        
		
		return new double[] {0, 0};
	}

	public static void main(String[] args) {
		try {
			PlayerStatsFetcher fetch = new PlayerStatsFetcher();
			fetch.getGoalieStats("Roberto Luongo");
			/*String url = BASEURL + "/teams/" + property.getProperty("canucks") + "/profile.xml?api_key=" + APIKEY;
			HttpClient client = HttpClientBuilder.create().build();
			HttpGet get = new HttpGet(url);
			HttpResponse response = client.execute(get);
			
			if (response.getStatusLine().getStatusCode() == 200) {
				DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
				DocumentBuilder builder = factory.newDocumentBuilder();
                Document doc = builder.parse(response.getEntity().getContent());
                doc.getDocumentElement().normalize();
            	System.out.println("Root element :" + doc.getDocumentElement().getNodeName());
            	NodeList nList = doc.getElementsByTagName("player");
            	for (int i = 0; i < nList.getLength(); i++) {
            		Node node = nList.item(i);
            		if (node.getNodeType() == Node.ELEMENT_NODE) {
            			Element element = (Element) node;
            			System.out.println(element.getAttribute("first_name") + "_" + element.getAttribute("last_name") + " = " + element.getAttribute("id"));
            		}
            	}
            	
			}*/
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

}
