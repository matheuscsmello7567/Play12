package com.play12.dto;

import com.play12.enumeracao.FuncaoOperador;
import com.play12.enumeracao.TipoOperador;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OperadorDTO {

	private Long id;
	private String email;
	private String nickname;
	private String nomeCompleto;
	private String telefone;
	private TipoOperador tipo;
	private FuncaoOperador funcao;
	private Long squadId;
	private String squadNome;
	private Boolean pago;
	private Integer totalJogos;
	private Integer pontos;

}
