
package edu.uam.prestamos;

import java.nio.charset.StandardCharsets;
import java.util.*;
import javax.crypto.SecretKey;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.*;
import jakarta.servlet.DispatcherType;
import jakarta.servlet.http.*;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.*;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;
import org.springframework.web.filter.OncePerRequestFilter;

@Configuration
class SecurityConfig {

 @Bean
 PasswordEncoder encoder() {
  return new BCryptPasswordEncoder();
 }

 @Bean
 UserDetailsService users(
         PasswordEncoder e,
         @Value("${app.admin.password}") String admin,
         @Value("${app.user.password}") String user) {

  if (admin.isBlank() || user.isBlank()) {
   throw new IllegalArgumentException(
           "Configure contraseñas de demostración"
   );
  }

  return new InMemoryUserDetailsManager(
          User.withUsername("admin")
                  .password(e.encode(admin))
                  .roles("ADMIN")
                  .build(),

          User.withUsername("user")
                  .password(e.encode(user))
                  .roles("USER")
                  .build()
  );
 }

 @Bean
 JwtService jwt(@Value("${app.jwt.secret}") String secret) {
  return new JwtService(secret);
 }

 @Bean
 AuthenticationManager auth(
         UserDetailsService users,
         PasswordEncoder encoder) {

  var provider = new DaoAuthenticationProvider();
  provider.setUserDetailsService(users);
  provider.setPasswordEncoder(encoder);

  return new ProviderManager(provider);
 }

 @Bean
 CorsConfigurationSource cors(
         @Value("${app.frontend-origin}") String origin) {

  CorsConfiguration c = new CorsConfiguration();

  c.setAllowedOrigins(List.of(origin));
  c.setAllowedMethods(
          List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")
  );
  c.setAllowedHeaders(
          List.of("Authorization", "Content-Type")
  );

  UrlBasedCorsConfigurationSource source =
          new UrlBasedCorsConfigurationSource();

  source.registerCorsConfiguration("/**", c);

  return source;
 }

 @Bean
 SecurityFilterChain security(
         HttpSecurity http,
         JwtService jwt,
         UserDetailsService users) throws Exception {

  return http
          .cors(c -> {})
          .csrf(c -> c.disable())
          .sessionManagement(s -> s
                  .sessionCreationPolicy(
                          SessionCreationPolicy.STATELESS
                  )
          )
          .exceptionHandling(e -> e
                  .authenticationEntryPoint(
                          (req, res, ex) -> res.sendError(401)
                  )
                  .accessDeniedHandler(
                          (req, res, ex) -> res.sendError(403)
                  )
          )
          .authorizeHttpRequests(a -> a

                  // Permitir procesar respuestas de error
                  .dispatcherTypeMatchers(
                          DispatcherType.ERROR
                  ).permitAll()

                  // Inicio de sesión público
                  .requestMatchers(
                          HttpMethod.POST,
                          "/api/auth/login"
                  ).permitAll()

                  // Consultas permitidas a USER y ADMIN
                  .requestMatchers(
                          HttpMethod.GET,
                          "/api/equipos/**",
                          "/api/prestamos/**"
                  ).hasAnyRole("USER", "ADMIN")

                  // Operaciones administrativas
                  .requestMatchers(
                          "/api/equipos/**",
                          "/api/prestamos/**"
                  ).hasRole("ADMIN")

                  // Denegar cualquier otra solicitud
                  .anyRequest().denyAll()
          )
          .addFilterBefore(
                  new JwtFilter(jwt, users),
                  UsernamePasswordAuthenticationFilter.class
          )
          .build();
 }
}

class JwtService {

 private final SecretKey key;

 JwtService(String secret) {

  if (secret.getBytes(StandardCharsets.UTF_8).length < 32) {
   throw new IllegalArgumentException(
           "JWT_SECRET necesita al menos 32 bytes"
   );
  }

  key = Keys.hmacShaKeyFor(
          secret.getBytes(StandardCharsets.UTF_8)
  );
 }

 String create(UserDetails u) {

  Date now = new Date();

  return Jwts.builder()
          .subject(u.getUsername())
          .issuedAt(now)
          .expiration(
                  new Date(now.getTime() + 3600000)
          )
          .signWith(key)
          .compact();
 }

 String subject(String token) {

  return Jwts.parser()
          .verifyWith(key)
          .build()
          .parseSignedClaims(token)
          .getPayload()
          .getSubject();
 }
}

class JwtFilter extends OncePerRequestFilter {

 private final JwtService jwt;
 private final UserDetailsService users;

 JwtFilter(JwtService jwt, UserDetailsService users) {
  this.jwt = jwt;
  this.users = users;
 }

 @Override
 protected void doFilterInternal(
         HttpServletRequest req,
         HttpServletResponse res,
         FilterChain chain)
         throws java.io.IOException, ServletException {

  String header = req.getHeader("Authorization");

  if (header != null && header.startsWith("Bearer ")) {

   try {
    String username = jwt.subject(
            header.substring(7)
    );

    UserDetails user =
            users.loadUserByUsername(username);

    SecurityContextHolder.getContext()
            .setAuthentication(
                    new UsernamePasswordAuthenticationToken(
                            user,
                            null,
                            user.getAuthorities()
                    )
            );

   } catch (JwtException
            | IllegalArgumentException
            | UsernameNotFoundException ex) {

    SecurityContextHolder.clearContext();
   }
  }

  chain.doFilter(req, res);
 }
}
