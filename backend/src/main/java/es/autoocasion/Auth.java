package es.autoocasion;
import org.springframework.beans.factory.annotation.*;import org.springframework.http.*;import org.springframework.web.bind.annotation.*;import java.util.*;
@RestController @RequestMapping("/api/auth") @CrossOrigin(originPatterns="*") public class Auth {
 private final AdminSessions sessions; Auth(AdminSessions sessions){this.sessions=sessions;}
 @Value("${app.admin.email}") String email; @Value("${app.admin.password}") String password;
 @PostMapping("/login") public ResponseEntity<?> login(@RequestBody Map<String,String> data){if(email.equals(data.get("email"))&&password.equals(data.get("password")))return ResponseEntity.ok(Map.of("token",sessions.create(),"name","Administración")); return ResponseEntity.status(401).body(Map.of("message","Credenciales incorrectas"));}
}
