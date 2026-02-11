package com.play12.service;

import com.play12.dto.AddPlayersToGameDTO;
import com.play12.dto.GameDTO;
import com.play12.dto.GameOperadorDTO;
import com.play12.entity.Game;
import com.play12.entity.GameOperador;
import com.play12.entity.Operador;
import com.play12.repository.GameOperadorRepository;
import com.play12.repository.GameRepository;
import com.play12.repository.OperadorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class GameService {

	private final GameRepository gameRepository;
	private final GameOperadorRepository gameOperadorRepository;
	private final OperadorRepository operadorRepository;

	public GameDTO criar(GameDTO dto) {
		if (dto.getTitulo() == null || dto.getTitulo().isEmpty()) {
			throw new IllegalArgumentException("Título do jogo é obrigatório");
		}
		if (dto.getData() == null) {
			throw new IllegalArgumentException("Data do jogo é obrigatória");
		}
		if (dto.getHorario() == null) {
			throw new IllegalArgumentException("Horário do jogo é obrigatório");
		}
		if (dto.getLocal() == null || dto.getLocal().isEmpty()) {
			throw new IllegalArgumentException("Local do jogo é obrigatório");
		}
		if (dto.getTipo() == null) {
			throw new IllegalArgumentException("Tipo do jogo é obrigatório");
		}
		
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

	// ===== Game-Operador methods =====

	public List<GameOperadorDTO> listarOperadoresDoJogo(Long gameId) {
		return gameOperadorRepository.findByGameId(gameId)
				.stream()
				.map(this::mapToGameOperadorDTO)
				.collect(Collectors.toList());
	}

	public List<GameOperadorDTO> adicionarOperadores(Long gameId, AddPlayersToGameDTO dto) {
		Game game = gameRepository.findById(gameId)
				.orElseThrow(() -> new IllegalArgumentException("Jogo não encontrado"));

		if (dto.getPlayers() == null || dto.getPlayers().isEmpty()) {
			throw new IllegalArgumentException("Nenhum jogador selecionado");
		}

		List<GameOperador> added = new ArrayList<>();
		for (AddPlayersToGameDTO.PlayerEntry entry : dto.getPlayers()) {
			if (gameOperadorRepository.existsByGameIdAndOperadorId(gameId, entry.getOperadorId())) {
				log.info("Operador {} já está no jogo {}, pulando", entry.getOperadorId(), gameId);
				continue;
			}

			Operador operador = operadorRepository.findById(entry.getOperadorId())
					.orElseThrow(() -> new IllegalArgumentException("Operador " + entry.getOperadorId() + " não encontrado"));

			GameOperador go = GameOperador.builder()
					.game(game)
					.operador(operador)
					.team(entry.getTeam() != null ? entry.getTeam() : "BLUFOR")
					.squad(entry.getSquad() != null ? entry.getSquad() : "")
					.build();

			added.add(gameOperadorRepository.save(go));
		}

		// Atualizar contador de confirmados
		long count = gameOperadorRepository.countByGameId(gameId);
		game.setConfirmados((int) count);
		gameRepository.save(game);

		return added.stream().map(this::mapToGameOperadorDTO).collect(Collectors.toList());
	}

	public void removerOperadorDoJogo(Long gameId, Long operadorId) {
		if (!gameOperadorRepository.existsByGameIdAndOperadorId(gameId, operadorId)) {
			throw new IllegalArgumentException("Operador não está associado a este jogo");
		}
		gameOperadorRepository.deleteByGameIdAndOperadorId(gameId, operadorId);

		// Atualizar contador de confirmados
		Game game = gameRepository.findById(gameId).orElse(null);
		if (game != null) {
			long count = gameOperadorRepository.countByGameId(gameId);
			game.setConfirmados((int) count);
			gameRepository.save(game);
		}
	}

	private GameOperadorDTO mapToGameOperadorDTO(GameOperador go) {
		return GameOperadorDTO.builder()
				.id(go.getId())
				.gameId(go.getGame().getId())
				.operadorId(go.getOperador().getId())
				.nomeCompleto(go.getOperador().getNomeCompleto())
				.nickname(go.getOperador().getNickname())
				.team(go.getTeam())
				.squad(go.getSquad())
				.pontos(go.getOperador().getPontos())
				.build();
	}
}
