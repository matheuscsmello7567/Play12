package com.play12.entity;

import com.play12.enumeracao.TipoJogo;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "games")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Game {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String titulo;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private TipoJogo tipo;

	@Column(nullable = false)
	private LocalDate data;

	@Column(nullable = false)
	private LocalTime horario;

	@Column(nullable = false)
	private String local;

	@Column(nullable = false)
	private Integer confirmados = 0;

	@Column(nullable = false)
	private String status = "Próximo";
}
