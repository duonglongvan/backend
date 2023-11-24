package group.imip.connection;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

import java.util.Arrays;

public class Redis {
    @ConfigProperty(name = "redis.host")
    String hostname;
    @ConfigProperty(name = "redis.port")
    String port;
    @ConfigProperty(name = "redis.user")
    String user;
    @ConfigProperty(name = "redis.password")
    String password;
    private  static   Jedis jedis;
   private void connection(){
       JedisPool pool = new JedisPool(hostname, Integer.parseInt(port));
       try {
            jedis = pool.getResource();
           System.out.println("Connect redis successful!");
       }catch (Exception ignored){
            System.out.println("Not connect redis");
       }
    }
    public void  set(String key, String[] val){
        if(jedis==null) connection();
        jedis.set(key, Arrays.toString(val));
    }
    public  String get(String key){
       if(jedis==null) connection();
       return jedis.get(key);
    }
}
