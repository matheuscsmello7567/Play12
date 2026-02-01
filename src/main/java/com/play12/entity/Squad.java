package com.play12.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "squads")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Squad {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true)
	private String nome;

	@Column(nullable = false)
	private Integer qtdOperadores = 0;

	@Column(nullable = false)
	private Integer jogosJogados = 0;

	@Column(nullable = false)
	private Integer pontuacaoTotal = 0;
}
