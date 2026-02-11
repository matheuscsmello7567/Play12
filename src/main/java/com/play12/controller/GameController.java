package com.play12.controller;

import com.play12.dto.AddPlayersToGameDTO;
import com.play12.dto.GameDTO;
import com.play12.dto.GameOperadorDTO;
import com.play12.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jogos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GameController {

	private final GameService gameService;

	@GetMapping
	public ResponseEntity<List<GameDTO>> listar() {
		return ResponseEntity.ok(gameService.listar());
	}

	@GetMapping("/proximos")
	public ResponseEntity<List<GameDTO>> listarProximos() {
		return ResponseEntity.ok(gameService.listarProximos());
	}

	@PostMapping
	public ResponseEntity<GameDTO> criar(@RequestBody GameDTO dto) {
		return ResponseEntity.ok(gameService.criar(dto));
	}

	@PutMapping("/{id}")
	public ResponseEntity<GameDTO> atualizar(@PathVariable Long id, @RequestBody GameDTO dto) {
		return ResponseEntity.ok(gameService.atualizar(id, dto));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletar(@PathVariable Long id) {
		gameService.deletar(id);
		return ResponseEntity.noContent().build();
	}

	// ===== Game-Operador endpoints =====

	@GetMapping("/{gameId}/operadores")
	public ResponseEntity<List<GameOperadorDTO>> listarOperadoresDoJogo(@PathVariable Long gameId) {
		return ResponseEntity.ok(gameService.listarOperadoresDoJogo(gameId));
	}

	@PostMapping("/{gameId}/operadores")
	public ResponseEntity<Map<String, Object>> adicionarOperadores(
			@PathVariable Long gameId,
			@RequestBody AddPlayersToGameDTO dto) {
		Map<String, Object> response = new HashMap<>();
		try {
			List<GameOperadorDTO> added = gameService.adicionarOperadores(gameId, dto);
			response.put("success", true);
			response.put("message", added.size() + " operador(es) adicionado(s) ao jogo com sucesso!");
			response.put("data", added);
			return ResponseEntity.ok(response);
		} catch (IllegalArgumentException e) {
			response.put("success", false);
			response.put("message", e.getMessage());
			return ResponseEntity.badRequest().body(response);
		}
	}

	@DeleteMapping("/{gameId}/operadores/{operadorId}")
	public ResponseEntity<Map<String, Object>> removerOperadorDoJogo(
			@PathVariable Long gameId,
			@PathVariable Long operadorId) {
		Map<String, Object> response = new HashMap<>();
		try {
			gameService.removerOperadorDoJogo(gameId, operadorId);
			response.put("success", true);
			response.put("message", "Operador removido do jogo com sucesso!");
			return ResponseEntity.ok(response);
		} catch (IllegalArgumentException e) {
			response.put("success", false);
			response.put("message", e.getMessage());
			return ResponseEntity.badRequest().body(response);
		}
	}
}
