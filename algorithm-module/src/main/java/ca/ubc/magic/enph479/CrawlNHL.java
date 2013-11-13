package ca.ubc.magic.enph479;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

/**
 * A class to crawl http://canucks.nhl.com/club/stats.htm to get player stats.
 * 
 * @author chris.yoon90@gmail.com
 *
 */
@Deprecated
public class CrawlNHL {
	
	private final static String URL = "http://canucks.nhl.com/club/stats.htm";
	private static Properties property = new Properties();
	private Document doc = null;
	
	public CrawlNHL() throws IOException {
		try(InputStream fileInput = getClass().getResourceAsStream("/playerIds.properties")) {
			property.load(fileInput);
		}
		this.doc = Jsoup.connect(URL).get();
	}
	
	public List<Integer> getPlayerStats(String playerName) throws IOException {
		String[] names = playerName.split(" ");
		String nameWithUnderScore = names[0] + "_" + names[1];
		
		Elements es = doc.select("a[href=/club/player.htm?id=" + property.getProperty(nameWithUnderScore) + "]");
		
		if (es.size() == 1) {
			Element e = es.first();
			Element row = e.parent().parent().parent();
			//System.out.println(row.text());
			String[] columns = row.text().split(" ");
			//5: goals, 6: Assists, 7: Points, 8: plus/minus
			List<Integer> performance = new ArrayList<Integer>(4);
			performance.add(Integer.parseInt(columns[5]));
			performance.add(Integer.parseInt(columns[6]));
			performance.add(Integer.parseInt(columns[7]));
			performance.add(Integer.parseInt(columns[8]));

			return performance;
			
		} 
		
		System.err.println("Player " + playerName + " not found!");
		return new ArrayList<Integer>();
		
	}
	
	public List<Double> getGoalieStats(String goalieName) throws IOException {
		String[] names = goalieName.split(" ");
		String nameWithUnderScore = names[0] + "_" + names[1];
		
		Elements es = doc.select("a[href=/club/player.htm?id=" + property.getProperty(nameWithUnderScore) + "]");
		
		if (es.size() == 1) {
			Element e = es.first();
			Element row = e.parent().parent().parent();
			//System.out.println(row.text());
			String[] columns = row.text().split(" ");
			//6: goals against average, 7: wins, 8: losses, 13: save percentage
			List<Double> performance = new ArrayList<Double>(4);
			performance.add(Double.parseDouble(columns[6]));
			performance.add(Double.parseDouble(columns[7]));
			performance.add(Double.parseDouble(columns[8]));
			performance.add(Double.parseDouble(columns[13]));

			return performance;
			
		} 
		
		System.err.println("Goalie " + goalieName + " not found!");
		return new ArrayList<Double>();
		
	}

	public static void main(String[] args) {
		try {
			CrawlNHL crawler = new CrawlNHL();
			for (int i : crawler.getPlayerStats("Kevin Bieksa"))
				System.out.println(i);
			
			for (double d: crawler.getGoalieStats("Roberto Luongo"))
				System.out.println(d);
		
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		

	}

}
