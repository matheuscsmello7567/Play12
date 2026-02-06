package com.play12.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.play12.enumeracao.FuncaoOperador;
import com.play12.enumeracao.TipoOperador;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@Slf4j
public class OperadorAdminUpdateDTO {
	private TipoOperador tipo;
	private FuncaoOperador funcao;
	private Long squadId;
	private Boolean pago;
	private Integer pontos;
}
