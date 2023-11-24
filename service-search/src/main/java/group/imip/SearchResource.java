package group.imip;

import group.imip.services.ClickHouseService;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/search")
public class SearchResource {
    protected  static ClickHouseService clickHouseService;
    public  SearchResource() {
        clickHouseService = new ClickHouseService();
    }

    @GET()
    @Path("/logs")
    @Produces(MediaType.TEXT_PLAIN)
    public String logs() {
        try{
             clickHouseService.getLogs();
        }catch (Exception e){
            System.out.println(e.getMessage());
        }
        return "Logs";
    }
    @GET()
    @Path("/realtime")
    @Produces(MediaType.TEXT_PLAIN)
    public String realTime() {
        try{
           clickHouseService.getRealtimes();
        }catch (Exception ignored){

        }
        return "realtime";
    }
    @GET()
    @Path("/history")
    @Produces(MediaType.TEXT_PLAIN)
    public String history() {
        try {
            clickHouseService.getHistory();
        }catch (Exception ignored){

        }
        return "history";
    }
}
