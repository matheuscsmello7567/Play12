package com.play12.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.play12.config.MercadoPagoConfig;
import com.play12.dto.PaymentRequestDTO;
import com.play12.dto.PIXPaymentResponseDTO;
import com.play12.entity.Payment;
import com.play12.entity.Product;
import com.play12.repository.PaymentRepository;
import com.play12.repository.ProductRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
public class PaymentService {

    private static final String MERCADO_PAGO_API = "https://api.mercadopago.com";
    private final PaymentRepository paymentRepository;
    private final ProductRepository productRepository;
    private final MercadoPagoConfig config;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public PaymentService(PaymentRepository paymentRepository,
                         ProductRepository productRepository,
                         MercadoPagoConfig config) {
        this.paymentRepository = paymentRepository;
        this.productRepository = productRepository;
        this.config = config;
        this.objectMapper = new ObjectMapper();
        this.httpClient = HttpClient.newHttpClient();
    }

    @Transactional
    public PIXPaymentResponseDTO createPixPayment(PaymentRequestDTO request) {
        try {
            if (config.getAccessToken() == null || config.getAccessToken().isEmpty()) {
                throw new RuntimeException("Mercado Pago Access Token not configured");
            }

            // Buscar produto se informado
            Product product = null;
            if (request.getProductId() != null) {
                product = productRepository.findById(request.getProductId())
                        .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
            }

            // Preparar dados de pagamento
            Map<String, Object> paymentData = preparePaymentData(request, product);
            
            // Chamar API Mercado Pago
            String response = callMercadoPagoAPI(paymentData);
            JsonNode jsonResponse = objectMapper.readTree(response);

            // Salvar pagamento no banco
            Payment payment = createAndSavePayment(request, product, jsonResponse);

            // Construir resposta
            return buildResponse(jsonResponse, payment);

        } catch (IOException e) {
            log.error("Erro creating Pix payment", e);
            throw new RuntimeException("Erro ao criar pagamento: " + e.getMessage());
        }
    }

    private Map<String, Object> preparePaymentData(PaymentRequestDTO request, Product product) {
        Map<String, Object> data = new LinkedHashMap<>();

        BigDecimal amount = request.getAmount() != null ? request.getAmount() :
                           (product != null ? product.getPreco() : BigDecimal.ZERO);

        data.put("purpose", "wallet_purchase");
        data.put("external_reference", "PLAY12_" + UUID.randomUUID().toString());

        // Items
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("title", request.getDescription() != null ? request.getDescription() :
                         (product != null ? product.getNome() : "Compra Play12"));
        item.put("quantity", request.getQuantity() != null ? request.getQuantity() : 1);
        item.put("unit_price", amount.doubleValue());
        data.put("items", new Object[]{item});

        // Payer
        Map<String, Object> payer = new LinkedHashMap<>();
        payer.put("email", request.getPayerEmail());
        if (request.getPayerName() != null) {
            payer.put("name", request.getPayerName());
        }
        data.put("payer", payer);

        data.put("auto_return", "approved");

        return data;
    }

    private String callMercadoPagoAPI(Map<String, Object> paymentData) throws IOException {
        String payload = objectMapper.writeValueAsString(paymentData);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(MERCADO_PAGO_API + "/checkout/preferences"))
                .header("Authorization", "Bearer " + config.getAccessToken())
                .header("Content-Type", "application/json")
                .header("X-Idempotency-Key", UUID.randomUUID().toString())
                .POST(HttpRequest.BodyPublishers.ofString(payload))
                .build();

        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                return response.body();
            } else {
                log.error("Mercado Pago API error: {} - {}", response.statusCode(), response.body());
                throw new RuntimeException("Erro na API Mercado Pago: " + response.statusCode());
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IOException("Requisição interrompida", e);
        }
    }

    @Transactional
    private Payment createAndSavePayment(PaymentRequestDTO request, Product product, JsonNode response) {
        String transactionId = response.has("id") ? response.get("id").asText() :
                              UUID.randomUUID().toString();

        String qrCode = extractQrCode(response);
        String initPoint = response.has("init_point") ? response.get("init_point").asText() : "";

        Payment payment = Payment.builder()
                .transactionId(transactionId)
                .amount(request.getAmount())
                .status("PENDING")
                .paymentMethod("PIX")
                .qrCode(qrCode)
                .qrCodeUrl(initPoint)
                .payerEmail(request.getPayerEmail())
                .payerName(request.getPayerName())
                .quantity(request.getQuantity() != null ? request.getQuantity() : 1)
                .description(request.getDescription())
                .product(product)
                .expirationTime(LocalDateTime.now().plusMinutes(config.getPixExpirationMinutes()))
                .merchantOrderId(response.has("preference_id") ? response.get("preference_id").asText() : "")
                .build();

        return paymentRepository.save(payment);
    }

    private String extractQrCode(JsonNode response) {
        if (response.has("point_of_interaction")) {
            JsonNode poi = response.get("point_of_interaction");
            if (poi.has("transaction_data") && poi.get("transaction_data").has("qr_code")) {
                return poi.get("transaction_data").get("qr_code").asText();
            }
        }
        return null;
    }

    private PIXPaymentResponseDTO buildResponse(JsonNode response, Payment payment) {
        return PIXPaymentResponseDTO.builder()
                .transactionId(payment.getTransactionId())
                .qrCode(payment.getQrCode())
                .qrCodeUrl(payment.getQrCodeUrl())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .expirationTime(payment.getExpirationTime())
                .paymentLink(response.has("init_point") ? response.get("init_point").asText() : "")
                .message("QR Code gerado com sucesso! Escaneie para pagar com Pix.")
                .build();
    }

    @Transactional(readOnly = true)
    public Payment getPaymentStatus(String transactionId) {
        return paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new RuntimeException("Pagamento não encontrado"));
    }

    @Transactional
    public void updatePaymentStatus(String transactionId, String newStatus) {
        Payment payment = getPaymentStatus(transactionId);
        payment.setStatus(newStatus);
        if ("COMPLETED".equals(newStatus)) {
            payment.setCompletedAt(LocalDateTime.now());
        }
        paymentRepository.save(payment);
        log.info("Payment status updated: {} -> {}", transactionId, newStatus);
    }
}
