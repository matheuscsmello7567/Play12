package com.play12.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "game_operadores", uniqueConstraints = {
	@UniqueConstraint(columnNames = {"game_id", "operador_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameOperador {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "game_id", nullable = false)
	private Game game;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "operador_id", nullable = false)
	private Operador operador;

	@Column(nullable = false)
	@Builder.Default
	private String team = "BLUFOR";

	@Column(nullable = false)
	@Builder.Default
	private String squad = "";
}
