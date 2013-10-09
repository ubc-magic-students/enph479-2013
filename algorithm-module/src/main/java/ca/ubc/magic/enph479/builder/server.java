package ca.ubc.magic.enph479.builder;

import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;

public class server extends HttpServlet {
   int accesses = 0;

   public void doGet(HttpServletRequest request, HttpServletResponse response)
      throws IOException, ServletException
   {
	   String text = "This is from BE Java Server!";
	   text += "\r\nNumber of times this servlet has been accessed: " + accesses;
	   response.setContentType("text/plain");
	   response.setCharacterEncoding("UTF-8");
	   response.getWriter().write(text);
	   
	   accesses++;
   }
}