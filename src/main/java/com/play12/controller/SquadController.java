package com.play12.controller;

import com.play12.dto.SquadDTO;
import com.play12.service.SquadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/squads")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SquadController {

	private final SquadService squadService;

	@GetMapping
	public ResponseEntity<List<SquadDTO>> listar() {
		return ResponseEntity.ok(squadService.listar());
	}

	@PostMapping
	public ResponseEntity<SquadDTO> criar(@RequestBody SquadDTO dto) {
		return ResponseEntity.ok(squadService.criar(dto));
	}

	@PutMapping("/{id}")
	public ResponseEntity<SquadDTO> atualizar(@PathVariable Long id, @RequestBody SquadDTO dto) {
		return ResponseEntity.ok(squadService.atualizar(id, dto));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletar(@PathVariable Long id) {
		squadService.deletar(id);
		return ResponseEntity.noContent().build();
	}
}
