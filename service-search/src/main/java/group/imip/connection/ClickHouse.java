package group.imip.connection;

import com.clickhouse.jdbc.ClickHouseDataSource;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;

public class ClickHouse{
    private static Connection conn;

    public void connected() {
        String urls = "jdbc:ch://192.168.3.9"; // use http protocol and port 8123 by default
        Properties properties = new Properties();
        try {
            ClickHouseDataSource dataSource = new ClickHouseDataSource(urls, properties);
            conn = dataSource.getConnection("default", "imip@1234");
            System.out.println("Connection to clickhouse successful!");
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public  void  showAllDatabase(){
        if(conn==null) connected();
        try (Statement stmt = conn.createStatement()) {
            ResultSet rss = stmt.executeQuery("SHOW DATABASES");
            while (rss.next()) {
                System.out.println(rss.getObject(1));
            }
        }catch (SQLException e) {
            System.out.println(e.getSQLState());
        }
    }

    public  void  showAllTable(String tableName){
        if(conn==null) connected();
        try (   Statement stmt = conn.createStatement()) {
            ResultSet rss = stmt.executeQuery("SHOW TABLES FROM "+tableName);//SHOW TABLES FROM siem
            while (rss.next()) {
                System.out.println(rss.getObject(1));
            }
        }catch (SQLException e) {
            System.out.println(e.getSQLState());
        }
    }
   public void  query(){
       if(conn==null) connected();
       try (   Statement stmt = conn.createStatement()) {
        ResultSet rs = stmt.executeQuery("select * from siem.alerts3 limit 0,10");
        System.out.print("Time         ");
        System.out.print("  |  ");
        System.out.print("      Date         ");
        System.out.print("  | ");
        System.out.print("Stauts");
        System.out.print(" |  ");
        System.out.println("IP");
        System.out.println("--------------------------------------------------------------------");

        while (rs.next()) {
            System.out.print(rs.getObject(1));
            System.out.print("  |  ");
            System.out.print(rs.getObject(2));
            System.out.print("  |  ");
            System.out.print(rs.getObject(3));
            System.out.print("  |  ");
            System.out.println(rs.getObject(4));
            System.out.println("--------------------------------------------------------------------");
        }
       }catch (SQLException e) {
           System.out.println(e.getSQLState());
       }
    }
}