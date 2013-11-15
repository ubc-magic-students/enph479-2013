package ca.ubc.magic.enph479;

import java.io.DataOutputStream;
import java.net.ConnectException;
import java.net.Socket;
import java.util.List;

import org.quartz.DisallowConcurrentExecution;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.SchedulerContext;

import ca.ubc.magic.enph479.builder.Region;

@DisallowConcurrentExecution
public class WeatherJob implements Job{
	private static final int TCPPORT = 8080;

	@SuppressWarnings("unchecked")
	@Override
	public void execute(JobExecutionContext arg0) throws JobExecutionException {
		try {
			SchedulerContext schedulerContext = arg0.getScheduler().getContext();
			WoTDataFetcher wdf = (WoTDataFetcher) schedulerContext.get("wdf");
			
			String message = wdf.fetchNewData(false);
			if (message.length() != 0) {	
				//System.out.println("New Tweets detected!");
				
				try {
					Socket nodejs  = new Socket("localhost", TCPPORT);
					DataOutputStream outbound = new DataOutputStream(nodejs.getOutputStream());
					outbound.write(message.getBytes("UTF-8"));
					nodejs.close();
				}
				catch (ConnectException c) {
					System.err.println("No one is listening to the port");
				}
			}
			
		} catch (Exception e) {
			System.err.println("Error in WeatherJob");
			e.printStackTrace();
		}
	}
	
	private static String toJSONFormat(List<Region> regionList) {
		StringBuffer buffer = new StringBuffer();
		buffer.append("{");
		for (Region r : regionList) {
			buffer.append(r.toJSONFormat() + ",");
		}
		buffer.deleteCharAt(buffer.length()-1);
		buffer.append("}");
		return buffer.toString();
	}
	
	private static boolean sendInChunks(Socket s, String message) {
		int numCharacToSend = 30;
		try {
			DataOutputStream outbound = new DataOutputStream(s.getOutputStream());
			
			s.getOutputStream().write("{ \"status\": 1 }".getBytes("UTF-8"));
			int beginIndex = 0;
			int endIndex = numCharacToSend;
			while(beginIndex < message.length()) {
				if(endIndex > message.length()) {
					outbound.write(message.substring(beginIndex).getBytes("UTF-8"));
					break;
				} else {
					outbound.write(message.substring(beginIndex, endIndex).getBytes("UTF-8"));
				}
				beginIndex += numCharacToSend;
				endIndex += numCharacToSend;
			}
			s.getOutputStream().write("{ \"status\": 0 }".getBytes("UTF-8"));
			return true;
		} catch (Exception e) {
			System.err.println("Error in sending data.");
			return false;
		}
	}
}
