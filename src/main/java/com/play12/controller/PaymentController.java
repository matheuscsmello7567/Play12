package com.play12.controller;

import com.play12.dto.PaymentRequestDTO;
import com.play12.dto.PIXPaymentResponseDTO;
import com.play12.entity.Payment;
import com.play12.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@Tag(name = "Payment Management", description = "Pagamentos com Pix")
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/pix/create")
    @Operation(summary = "Criar pagamento Pix", description = "Gera QR Code para pagamento")
    public ResponseEntity<PIXPaymentResponseDTO> createPixPayment(@RequestBody PaymentRequestDTO request) {
        try {
            log.info("Criando pagamento Pix para: {}", request.getPayerEmail());
            
            // Validações básicas
            if (request.getPayerEmail() == null || request.getPayerEmail().isEmpty()) {
                return ResponseEntity.badRequest().body(
                    PIXPaymentResponseDTO.builder()
                            .status("ERROR")
                            .message("Email do pagador é obrigatório")
                            .build()
                );
            }

            if (request.getAmount() == null || request.getAmount().signum() <= 0) {
                return ResponseEntity.badRequest().body(
                    PIXPaymentResponseDTO.builder()
                            .status("ERROR")
                            .message("Valor deve ser maior que zero")
                            .build()
                );
            }

            PIXPaymentResponseDTO response = paymentService.createPixPayment(request);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Erro create payment", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                PIXPaymentResponseDTO.builder()
                        .status("ERROR")
                        .message("Erro ao criar pagamento: " + e.getMessage())
                        .build()
            );
        }
    }

    @GetMapping("/pix/status/{transactionId}")
    @Operation(summary = "Verificar status", description = "Retorna status do pagamento")
    public ResponseEntity<?> getPaymentStatus(@PathVariable String transactionId) {
        try {
            Payment payment = paymentService.getPaymentStatus(transactionId);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            log.error("Erro getting payment status", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                Map.of("error", "Pagamento não encontrado")
            );
        }
    }

    @PostMapping("/webhook/mercadopago")
    @Operation(summary = "Webhook Mercado Pago", description = "Recebe notificações de pagamento")
    public ResponseEntity<?> handleWebhook(@RequestParam Map<String, String> data) {
        try {
            log.info("Webhook recebido: {}", data);
            // Processar webhook conforme necessário
            return ResponseEntity.ok(Map.of("status", "received"));
        } catch (Exception e) {
            log.error("Erro processing webhook", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
