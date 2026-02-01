package com.play12.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
	private Long id;
	private String nome;
	private String categoria;
	private BigDecimal preco;
	private String descricao;
	private String imagemUrl;
	private Boolean ativo;
}
