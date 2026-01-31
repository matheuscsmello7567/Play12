package com.play12.service;

import com.play12.dto.CadastroDTO;
import com.play12.dto.LoginDTO;
import com.play12.dto.OperadorDTO;
import com.play12.entity.Operador;
import com.play12.enumeracao.TipoOperador;
import com.play12.repository.OperadorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class OperadorService {

	private final OperadorRepository operadorRepository;

	public OperadorDTO cadastrar(CadastroDTO dto) {
		log.info("Cadastrando novo operador: {}", dto.getEmail());

		if (operadorRepository.existsByEmail(dto.getEmail())) {
			throw new IllegalArgumentException("Email já cadastrado");
		}

		if (operadorRepository.existsByNickname(dto.getNickname())) {
			throw new IllegalArgumentException("Nickname já cadastrado");
		}

		Operador operador = Operador.builder()
				.email(dto.getEmail())
				.nickname(dto.getNickname())
				.senha(dto.getSenha())
				.nomeCompleto(dto.getNomeCompleto())
				.telefone(dto.getTelefone())
				.tipo(TipoOperador.JOGADOR)
				.totalJogos(0)
				.build();

		operador = operadorRepository.save(operador);
		return mapToDTO(operador);
	}

	public OperadorDTO login(LoginDTO dto) {
		log.info("Login do operador: {}", dto.getEmail());

		Operador operador = operadorRepository.findByEmail(dto.getEmail())
				.orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

		if (!operador.getSenha().equals(dto.getSenha())) {
			throw new IllegalArgumentException("Senha incorreta");
		}

		return mapToDTO(operador);
	}

	public OperadorDTO buscarPorId(Long id) {
		Operador operador = operadorRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Operador não encontrado"));
		return mapToDTO(operador);
	}

	public List<OperadorDTO> listarTodos() {
		return operadorRepository.findAll()
				.stream()
				.map(this::mapToDTO)
				.collect(Collectors.toList());
	}

	public OperadorDTO atualizar(Long id, CadastroDTO dto) {
		Operador operador = operadorRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Operador não encontrado"));

		operador.setNomeCompleto(dto.getNomeCompleto());
		operador.setTelefone(dto.getTelefone());

		operador = operadorRepository.save(operador);
		return mapToDTO(operador);
	}

	public void deletar(Long id) {
		if (!operadorRepository.existsById(id)) {
			throw new IllegalArgumentException("Operador não encontrado");
		}
		operadorRepository.deleteById(id);
	}

	private OperadorDTO mapToDTO(Operador operador) {
		return OperadorDTO.builder()
				.id(operador.getId())
				.email(operador.getEmail())
				.nickname(operador.getNickname())
				.nomeCompleto(operador.getNomeCompleto())
				.telefone(operador.getTelefone())
				.tipo(operador.getTipo())
				.totalJogos(operador.getTotalJogos())
				.build();
	}

}
