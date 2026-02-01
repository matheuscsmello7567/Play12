package com.play12.controller;

import com.play12.dto.CommunityPhotoDTO;
import com.play12.service.CommunityPhotoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comunidade/fotos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CommunityController {

	private final CommunityPhotoService communityPhotoService;

	@GetMapping
	public ResponseEntity<List<CommunityPhotoDTO>> listar() {
		return ResponseEntity.ok(communityPhotoService.listar());
	}

	@PostMapping
	public ResponseEntity<CommunityPhotoDTO> criar(@RequestBody CommunityPhotoDTO dto) {
		return ResponseEntity.ok(communityPhotoService.criar(dto));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletar(@PathVariable Long id) {
		communityPhotoService.deletar(id);
		return ResponseEntity.noContent().build();
	}
}
