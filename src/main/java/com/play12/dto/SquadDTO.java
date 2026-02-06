package com.play12.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SquadDTO {
	private Long id;
	private String nome;
	private Integer qtdOperadores;
	private Integer jogosJogados;
	private Integer pontuacaoTotal;
	private String descricao;
}
