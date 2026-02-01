package com.play12.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardDTO {
	private Long totalJogadores;
	private Long confirmados;
	private Long jogosAgendados;
	private List<GameDTO> proximosJogos;
}
