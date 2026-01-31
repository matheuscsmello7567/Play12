package com.play12.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CadastroDTO {

	@NotBlank(message = "Email é obrigatório")
	@Email(message = "Email deve ser válido")
	private String email;

	@NotBlank(message = "Nickname é obrigatório")
	private String nickname;

	@NotBlank(message = "Senha é obrigatória")
	private String senha;

	@NotBlank(message = "Nome completo é obrigatório")
	private String nomeCompleto;

	private String telefone;

}
