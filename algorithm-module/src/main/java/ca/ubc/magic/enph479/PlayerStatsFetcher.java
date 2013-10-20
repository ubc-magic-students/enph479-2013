package ca.ubc.magic.enph479;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.w3c.dom.Node;

public class PlayerStatsFetcher {
	
	private static final String APIKEY = "ejrs3nexcrsf2z6s84darvbp";
	private static final String BASEURL = "http://api.sportsdatallc.org/nhl-t3";
	private static final String CANUCKSID = "4415b0a7-0f24-11e2-8525-18a905767e44";

	public static void main(String[] args) {
		try {
			String url = BASEURL + "/teams/" + CANUCKSID + "/profile.xml?api_key=" + APIKEY;
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
            			System.out.println(element.getAttribute("full_name"));
            		}
            	}
            	
			}
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

}
