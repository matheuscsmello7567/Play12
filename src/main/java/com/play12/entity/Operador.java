package com.play12.entity;

import com.play12.enumeracao.FuncaoOperador;
import com.play12.enumeracao.TipoOperador;
import com.play12.entity.Squad;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "operadores")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Operador {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(unique = true, nullable = false)
	private String email;

	@Column(unique = true, nullable = false)
	private String nickname;

	@Column(nullable = false)
	private String senha;

	@Column(nullable = false)
	private String nomeCompleto;

	@Column
	private String telefone;

	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	@lombok.Builder.Default
	private TipoOperador tipo = TipoOperador.JOGADOR;

	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	@lombok.Builder.Default
	private FuncaoOperador funcao = FuncaoOperador.OPERADOR;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "squad_id")
	private Squad squad;

	@Column(nullable = false)
	@lombok.Builder.Default
	private Boolean pago = false;

	@Column(nullable = false)
	@lombok.Builder.Default
	private Integer totalJogos = 0;

	@Column(nullable = false, columnDefinition = "INTEGER DEFAULT 0")
	@lombok.Builder.Default
	private Integer pontos = 0;

}
