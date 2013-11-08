package ca.ubc.magic.enph479;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Random;
import java.util.TimeZone;

import ca.ubc.magic.enph479.builder.TweetInstance;
import ca.ubc.magic.enph479.builder.TwitterObject;
import ca.ubc.magic.enph479.builder.RegionObject.regionX;

/**
 * DB_Handler is the database handler to talk to the mySQL database
 * @author richardlee@hotmail.ca
 *
 */
public class DB_Update {
	
	static private String url = "jdbc:mysql://localhost:3306/ENPH479";
	static private String user = "root";
	static private String password = "";
    
    static Connection con = null;
    
    public static void main(String[] args) throws Exception {
    	
    	con = DriverManager.getConnection(url, user, password);
    	
    	if(con == null)
    		System.out.println("Failed to connect to db...");
    	
    	Statement st = con.createStatement();
    	String mysql_select_command = "SELECT * FROM timeplay_data";
        ResultSet rs = st.executeQuery(mysql_select_command);
        
        while (rs.next()) {
        	int db_id = rs.getInt("db_id");
			double sentiment = rs.getDouble("sentiment");
			
			Random generatorSign = new Random();
			double rand_sign = generatorSign.nextDouble();
			
			Random generator = new Random();
			double rand = generator.nextDouble() * 0.3;
			
			double sentiment_salted = 0.0;
			if (sentiment == 0) {
				//do nothing
			}
			else if (sentiment == 4)
				sentiment_salted = sentiment - rand;
			else {
				if(rand_sign <= 0.5)
					rand *= (-1);
				sentiment_salted = sentiment + rand;
			}
			
			Statement st_new = con.createStatement();
			String mysql_insert_command = "UPDATE timeplay_data SET sentiment=" + sentiment_salted + " WHERE db_id=" + db_id;
			st_new.executeUpdate(mysql_insert_command);
			
			System.out.println("Updating db with db_id=" + db_id + " from sentiment=" + sentiment + " to " + sentiment_salted);
		}
    }
}
