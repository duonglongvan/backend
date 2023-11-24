package group.imip.services;

import group.imip.connection.ClickHouse;

public class ClickHouseService {
    private  static ClickHouse clickHouse;
   public  ClickHouseService(){
        clickHouse = new ClickHouse();
    }
    public void getLogs(){
        System.out.println("start show database");
        clickHouse.showAllDatabase();
    }
    public void getRealtimes(){

        System.out.println("start show table");clickHouse.showAllTable("siem");
    }
    public void getHistory(){
        clickHouse.query();
    }

}
