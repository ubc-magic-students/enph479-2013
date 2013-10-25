package ca.ubc.magic.enph479;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class DB_Testing {

	public static void main(String[] args) throws Exception {
		
		Connection con = null;
        Statement st = null;
        ResultSet rs = null;

        String url = "jdbc:mysql://localhost:3306/ENPH479";
        String user = "root";
        String password = "";

        try {
            con = DriverManager.getConnection(url, user, password);
            
            st = con.createStatement();
            
            String mysql1 = "INSERT INTO tweet_data " + "VALUES (1, 1234, 'Jan 01 1800 23:59:59', 111, 111, 999, 'sensor_test', 'test test test', 999, -1, -1)";
            //String mysql2 = "SELECT * FROM tweet_data";
            String mysql3 = "SELECT MAX(db_id) AS db_id FROM tweet_data";
            //String mysql4 = "DELETE FROM tweet_data WHERE db_id=1";
            
            st.executeUpdate(mysql1);
            //rs = st.executeQuery(mysql1);

            if (rs.next()) {
                System.out.println(rs.getString(1) + rs.getString(2) + rs.getString(3));
            }

        } catch (SQLException ex) {
        	System.err.println(ex.getMessage());
        } finally {
            try {
                if (rs != null) {
                    rs.close();
                }
                if (st != null) {
                    st.close();
                }
                if (con != null) {
                    con.close();
                }

            } catch (SQLException ex) {
            }
        }
		
	}
	
}
