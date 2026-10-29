package edu.uam.prestamos;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/auth") class AuthController {
 private final AuthenticationManager auth;private final JwtService jwt;
 AuthController(AuthenticationManager a,JwtService j){auth=a;jwt=j;}
 @PostMapping("/login") ResponseEntity<?> login(@Valid @RequestBody LoginRequest request){try{Authentication a=auth.authenticate(new UsernamePasswordAuthenticationToken(request.username(),request.password()));UserDetails u=(UserDetails)a.getPrincipal();return ResponseEntity.ok(new LoginResponse(jwt.create(u),"Bearer",u.getAuthorities().iterator().next().getAuthority().replace("ROLE_","")));}catch(AuthenticationException ex){return ResponseEntity.status(401).body(java.util.Map.of("error","Credenciales incorrectas"));}}
}
