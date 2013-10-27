package ca.ubc.magic.enph479;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class CrawlNHL {
	
	private final static String URL = "http://canucks.nhl.com/club/stats.htm";
	private static Properties property = new Properties();
	
	public CrawlNHL() throws IOException {
		try(InputStream fileInput = getClass().getResourceAsStream("/playerIds.properties")) {
			property.load(fileInput);
		}
	}
	
	public void test(String playerName) throws IOException {
		String[] names = playerName.split(" ");
		String nameWithUnderScore = names[0] + "_" + names[1];
		
		Document doc = Jsoup.connect(URL).get();
		Elements es = doc.select("a[href=/club/player.htm?id=" + property.getProperty(nameWithUnderScore) + "]");
		
		if (es.size() == 1) {
			Element e = es.first();
			System.out.println(e.text());
			Element row = e.parent().parent().parent();
			System.out.println(row.text());
		} else if(es.size() == 0) {
			System.err.println("Player " + playerName + " not found!");
		}
		
	}

	public static void main(String[] args) {
		try {
			CrawlNHL crawler = new CrawlNHL();
			crawler.test("Kevin Bieksa");
		
		
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		

	}

}
