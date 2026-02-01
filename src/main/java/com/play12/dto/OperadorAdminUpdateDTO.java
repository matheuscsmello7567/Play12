package com.play12.dto;

import com.play12.enumeracao.FuncaoOperador;
import com.play12.enumeracao.TipoOperador;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OperadorAdminUpdateDTO {
	private TipoOperador tipo;
	private FuncaoOperador funcao;
	private Long squadId;
	private Boolean pago;
}
