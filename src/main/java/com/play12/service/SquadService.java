package com.play12.service;

import com.play12.dto.SquadDTO;
import com.play12.entity.Squad;
import com.play12.repository.SquadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SquadService {

	private final SquadRepository squadRepository;

	public SquadDTO criar(SquadDTO dto) {
		if (squadRepository.existsByNome(dto.getNome())) {
			throw new IllegalArgumentException("Squad já existe");
		}
		Squad squad = Squad.builder()
				.nome(dto.getNome())
				.qtdOperadores(dto.getQtdOperadores() != null ? dto.getQtdOperadores() : 0)
				.jogosJogados(dto.getJogosJogados() != null ? dto.getJogosJogados() : 0)
				.pontuacaoTotal(dto.getPontuacaoTotal() != null ? dto.getPontuacaoTotal() : 0)
				.build();
		squad = squadRepository.save(squad);
		return mapToDTO(squad);
	}

	public List<SquadDTO> listar() {
		return squadRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
	}

	public SquadDTO atualizar(Long id, SquadDTO dto) {
		Squad squad = squadRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Squad não encontrado"));
		squad.setNome(dto.getNome());
		squad.setQtdOperadores(dto.getQtdOperadores() != null ? dto.getQtdOperadores() : squad.getQtdOperadores());
		squad.setJogosJogados(dto.getJogosJogados() != null ? dto.getJogosJogados() : squad.getJogosJogados());
		squad.setPontuacaoTotal(dto.getPontuacaoTotal() != null ? dto.getPontuacaoTotal() : squad.getPontuacaoTotal());
		return mapToDTO(squadRepository.save(squad));
	}

	public void deletar(Long id) {
		if (!squadRepository.existsById(id)) {
			throw new IllegalArgumentException("Squad não encontrado");
		}
		squadRepository.deleteById(id);
	}

	private SquadDTO mapToDTO(Squad squad) {
		return SquadDTO.builder()
				.id(squad.getId())
				.nome(squad.getNome())
				.qtdOperadores(squad.getQtdOperadores())
				.jogosJogados(squad.getJogosJogados())
				.pontuacaoTotal(squad.getPontuacaoTotal())
				.build();
	}
}
