package com.play12.dto;

import com.play12.enumeracao.TipoJogo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameDTO {
	private Long id;
	private String titulo;
	private TipoJogo tipo;
	private LocalDate data;
	private LocalTime horario;
	private String local;
	private Integer confirmados;
	private String status;
}
