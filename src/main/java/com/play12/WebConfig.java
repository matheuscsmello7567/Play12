package com.play12;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Redireciona qualquer rota que não seja da API para o index.html do React
        registry.addViewController("/{path:[^\\.]*}").setViewName("forward:/index.html");
    }
}
