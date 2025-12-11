package com.sdsucrimereporter.dbapi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

        @Bean
        public CorsFilter corsFilter() {
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                CorsConfiguration config = new CorsConfiguration();

                // Allow credentials (cookies, authorization headers)
                config.setAllowCredentials(true);

                // Allow your frontend origin
                config.setAllowedOriginPatterns(Arrays.asList("http://localhost:5173", "http://localhost:*"));

                // Allow all headers
                config.addAllowedHeader("*");

                // Allow all HTTP methods (GET, POST, PUT, DELETE, OPTIONS, etc.)
                config.addAllowedMethod("*");

                // Expose these headers to the browser
                config.setExposedHeaders(Arrays.asList(
                                "Authorization",
                                "Content-Type",
                                "X-Requested-With",
                                "Access-Control-Allow-Origin",
                                "Access-Control-Allow-Credentials"));

                source.registerCorsConfiguration("/**", config);
                return new CorsFilter(source);
        }
}