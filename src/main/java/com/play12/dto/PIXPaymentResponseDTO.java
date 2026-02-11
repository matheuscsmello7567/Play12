package com.play12.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SuppressWarnings("unused")
public class PIXPaymentResponseDTO {
    private String transactionId;
    private String qrCode;
    private String qrCodeUrl;
    private BigDecimal amount;
    private String status;
    private LocalDateTime expirationTime;
    private String paymentLink;
    private String message;
}
