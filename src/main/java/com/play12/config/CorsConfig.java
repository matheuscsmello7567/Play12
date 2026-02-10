package com.play12.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		String[] allowedOrigins;
		String renderUrl = System.getenv("RENDER_EXTERNAL_URL");
		
		if (renderUrl != null && !renderUrl.isEmpty()) {
			// Em produção (Render)
			allowedOrigins = new String[]{renderUrl};
		} else {
			// Em desenvolvimento (localhost)
			allowedOrigins = new String[]{"http://localhost:3000", "http://localhost:8080"};
		}
		
		registry.addMapping("/**")
				.allowedOrigins(allowedOrigins)
				.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
				.allowCredentials(true)
				.maxAge(3600);
	}

}
