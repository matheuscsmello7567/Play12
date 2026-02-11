package com.play12.repository;

import com.play12.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByTransactionId(String transactionId);
    Optional<Payment> findByMerchantOrderId(String merchantOrderId);
    List<Payment> findByPayerEmail(String payerEmail);
    List<Payment> findByStatus(String status);
}
