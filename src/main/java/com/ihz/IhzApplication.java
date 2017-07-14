package com.ihz;

import com.ihz.storage.StorageProperties;
import com.ihz.storage.StorageService;
import it.ozimov.springboot.mail.configuration.EnableEmailTools;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableEmailTools
@EnableConfigurationProperties(StorageProperties.class)
public class IhzApplication {
    public static void main(String[] args) {
        SpringApplication.run(IhzApplication.class, args);
    }

    @Bean
    CommandLineRunner init(StorageService storageService) {
        return (args) -> {
            storageService.init();
        };
    }
}
