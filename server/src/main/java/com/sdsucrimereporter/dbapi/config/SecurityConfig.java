package com.sdsucrimereporter.dbapi.config;

import com.sdsucrimereporter.dbapi.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // DISABLE CSRF
                .csrf(csrf -> csrf.disable())

                // STATELESS SESSIONS
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // AUTHORIZATION RULES
                .authorizeHttpRequests(auth -> auth
                        // ALLOW OPTIONS REQUESTS (CORS PREFLIGHT) - THIS IS THE KEY FIX!
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // PUBLIC ENDPOINTS
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/reports").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/reports/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/reports/image/**").permitAll()

                        // Legacy endpoints
                        .requestMatchers(HttpMethod.GET, "/reports").permitAll()
                        .requestMatchers(HttpMethod.GET, "/reports/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/reports/image/**").permitAll()

                        // AUTHENTICATED ENDPOINTS
                        .requestMatchers("/api/reports/**").authenticated()
                        .requestMatchers("/reports/**").authenticated()

                        // Default
                        .anyRequest().authenticated());

        // Add JWT filter
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}