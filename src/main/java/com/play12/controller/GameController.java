package com.play12.controller;

import com.play12.dto.GameDTO;
import com.play12.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
