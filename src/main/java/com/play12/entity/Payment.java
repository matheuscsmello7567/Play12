package com.play12.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SuppressWarnings("unused")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String transactionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private String status; // PENDING, COMPLETED, FAILED, etc

    @Column
    private String paymentMethod; // PIX

    @Column(columnDefinition = "TEXT")
    private String qrCode;

    @Column(columnDefinition = "TEXT")
    private String qrCodeUrl;

    @Column
    private String payerEmail;

    @Column
    private String payerName;

    @Column
    private Integer quantity;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime completedAt;

    @Column
    private LocalDateTime expirationTime;

    @Column
    private String merchantOrderId;

    @Transient
    private String responseData;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
