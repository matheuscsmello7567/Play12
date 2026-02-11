package com.play12.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SuppressWarnings("unused")
public class Product {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String nome;

	@Column(nullable = false)
	private String categoria;

	@Column(nullable = false)
	private BigDecimal preco;

	@Column(length = 2000)
	private String descricao;

	@Column
	private String imagemUrl;

	@Column(nullable = false)
	private Boolean ativo = true;
}
