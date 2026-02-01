package com.play12.controller;

import com.play12.dto.DashboardDTO;
import com.play12.dto.GameDTO;
import com.play12.entity.Game;
import com.play12.repository.GameRepository;
import com.play12.repository.OperadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

	private final OperadorRepository operadorRepository;
	private final GameRepository gameRepository;

	@GetMapping("/dashboard")
	public ResponseEntity<DashboardDTO> dashboard() {
		Long totalJogadores = operadorRepository.count();
		Long confirmados = operadorRepository.countByPagoTrue();
		Long jogosAgendados = gameRepository.countByDataGreaterThanEqual(LocalDate.now());
		List<GameDTO> proximosJogos = gameRepository.findByDataGreaterThanEqualOrderByDataAsc(LocalDate.now())
				.stream().map(this::mapGame).collect(Collectors.toList());

		return ResponseEntity.ok(DashboardDTO.builder()
				.totalJogadores(totalJogadores)
				.confirmados(confirmados)
				.jogosAgendados(jogosAgendados)
				.proximosJogos(proximosJogos)
				.build());
	}

	private GameDTO mapGame(Game game) {
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
