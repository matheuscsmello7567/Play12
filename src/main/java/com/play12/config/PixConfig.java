package com.play12.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PixConfig {

    @Value("${pix.merchant-key:}")
    private String merchantKey;

    @Value("${pix.merchant-cpf:}")
    private String merchantCpf;

    @Value("${pix.merchant-name:Play12}")
    private String merchantName;

    @Value("${pix.qr-code-size:300}")
    private Integer qrCodeSize;

    @Value("${pix.expiration-minutes:30}")
    private Integer expirationMinutes;

    @Value("${pix.enable-mock:true}")
    private Boolean enableMock;

    @Value("${pix.bank-integration:MOCK}")
    private String bankIntegration; // MOCK, ITAU, BRADESCO, SANTANDER, CAIXA, BB

    public String getMerchantKey() {
        return merchantKey;
    }

    public String getMerchantCpf() {
        return merchantCpf;
    }

    public String getMerchantName() {
        return merchantName;
    }

    public Integer getQrCodeSize() {
        return qrCodeSize;
    }

    public Integer getExpirationMinutes() {
        return expirationMinutes;
    }

    public Boolean getEnableMock() {
        return enableMock;
    }

    public String getBankIntegration() {
        return bankIntegration;
    }
}
