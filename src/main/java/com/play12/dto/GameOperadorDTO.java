package com.play12.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameOperadorDTO {
	private Long id;
	private Long gameId;
	private Long operadorId;
	private String nomeCompleto;
	private String nickname;
	private String team;
	private String squad;
	private Integer pontos;
}
