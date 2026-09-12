package es.autoocasion;
import org.springframework.stereotype.Service;import java.time.*;import java.util.*;import java.util.concurrent.*;
@Service public class AdminSessions {
 private final Map<String,Instant> tokens=new ConcurrentHashMap<>();
 public String create(){String token=UUID.randomUUID()+"."+UUID.randomUUID();tokens.put(token,Instant.now().plus(Duration.ofMinutes(30)));return token;}
 public boolean valid(String value){if(value==null||!value.startsWith("Bearer "))return false;Instant expiry=tokens.get(value.substring(7));return expiry!=null&&expiry.isAfter(Instant.now());}
}
