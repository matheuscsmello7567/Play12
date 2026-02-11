package com.play12.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuppressWarnings("unused")
public class PaymentRequestDTO {
    private Long productId;
    private BigDecimal amount;
    private String description;
    private String payerEmail;
    private String payerName;
    private Integer quantity = 1;
}
