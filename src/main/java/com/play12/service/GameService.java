package com.play12.service;

import com.play12.dto.GameDTO;
import com.play12.entity.Game;
import com.play12.repository.GameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class GameService {

	private final GameRepository gameRepository;

	public GameDTO criar(GameDTO dto) {
		Game game = Game.builder()
				.titulo(dto.getTitulo())
				.tipo(dto.getTipo())
				.data(dto.getData())
				.horario(dto.getHorario())
				.local(dto.getLocal())
				.confirmados(dto.getConfirmados() != null ? dto.getConfirmados() : 0)
				.status(dto.getStatus() != null ? dto.getStatus() : "Próximo")
				.build();
		return mapToDTO(gameRepository.save(game));
	}

	public List<GameDTO> listar() {
		return gameRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
	}

	public List<GameDTO> listarProximos() {
		return gameRepository.findByDataGreaterThanEqualOrderByDataAsc(LocalDate.now())
				.stream().map(this::mapToDTO).collect(Collectors.toList());
	}

	public GameDTO atualizar(Long id, GameDTO dto) {
		Game game = gameRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Jogo não encontrado"));
		game.setTitulo(dto.getTitulo());
		game.setTipo(dto.getTipo());
		game.setData(dto.getData());
		game.setHorario(dto.getHorario());
		game.setLocal(dto.getLocal());
		if (dto.getConfirmados() != null) {
			game.setConfirmados(dto.getConfirmados());
		}
		if (dto.getStatus() != null) {
			game.setStatus(dto.getStatus());
		}
		return mapToDTO(gameRepository.save(game));
	}

	public void deletar(Long id) {
		if (!gameRepository.existsById(id)) {
			throw new IllegalArgumentException("Jogo não encontrado");
		}
		gameRepository.deleteById(id);
	}

	private GameDTO mapToDTO(Game game) {
		return GameDTO.builder()
				.id(game.getId())
				.titulo(game.getTitulo())
				.tipo(game.getTipo())
				.data(game.getData())
				.horario(game.getHorario())
				.local(game.getLocal())
				.confirmados(game.getConfirmados())
				.status(game.getStatus())
				.build();
	}
}
