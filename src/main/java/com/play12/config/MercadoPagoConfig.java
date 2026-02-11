package com.play12.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MercadoPagoConfig {

    @Value("${mercadopago.access-token:}")
    private String accessToken;

    @Value("${mercadopago.public-key:}")
    private String publicKey;

    @Value("${app.pix.expiration-minutes:30}")
    private Integer pixExpirationMinutes;

    public String getAccessToken() {
        return accessToken;
    }

    public String getPublicKey() {
        return publicKey;
    }

    public Integer getPixExpirationMinutes() {
        return pixExpirationMinutes;
    }
}
