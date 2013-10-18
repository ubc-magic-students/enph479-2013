package ca.ubc.magic.enph479;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class DB_Handler {
	
	private String url = "jdbc:mysql://localhost:3306/ENPH479";
	private String user = "root";
	private String password = "";
    
    Connection con = null;

	public boolean prepareDB() throws Exception  {
		try {
			con = DriverManager.getConnection(url, user, password);
			if(con == null)
				return false;
			else
				return true;
		} catch (SQLException ex) {
        	System.err.println(ex.getMessage());
        	return false;
		}
	}
}
