package com.example.photoStudio.config;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
public class EnvConfigValidator {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.datasource.username}")
    private String dbUsername;

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    @PostConstruct
    public void validateEnvironment() {
        log.info("Performing Spring Boot application environment configuration checks...");

        List<String> missingVars = new ArrayList<>();

        if (isEmpty(jwtSecret)) {
            missingVars.add("JWT_SECRET (jwt.secret)");
        }
        if (jwtExpiration <= 0) {
            missingVars.add("JWT_EXPIRATION (jwt.expiration)");
        }
        if (isEmpty(dbUrl)) {
            missingVars.add("SPRING_DATASOURCE_URL (spring.datasource.url)");
        }
        if (isEmpty(dbUsername)) {
            missingVars.add("SPRING_DATASOURCE_USERNAME (spring.datasource.username)");
        }
        if (isEmpty(cloudName)) {
            missingVars.add("CLOUDINARY_CLOUD_NAME (cloudinary.cloud-name)");
        }
        if (isEmpty(apiKey)) {
            missingVars.add("CLOUDINARY_API_KEY (cloudinary.api-key)");
        }
        if (isEmpty(apiSecret)) {
            missingVars.add("CLOUDINARY_API_SECRET (cloudinary.api-secret)");
        }

        if (!missingVars.isEmpty()) {
            log.error("===============================================================================");
            log.error("CRITICAL APPLICATION STARTUP WARNING / ERROR");
            log.error("The following required environment settings are missing or unconfigured:");
            for (String missing : missingVars) {
                log.error("  - Missing required setting: {}", missing);
            }
            log.error("Default local fallbacks will be utilized. In Production (Render), please configure these in Dashboard.");
            log.error("===============================================================================");
        } else {
            log.info("All environment configuration variables resolved successfully.");
        }
    }

    private boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }
}
