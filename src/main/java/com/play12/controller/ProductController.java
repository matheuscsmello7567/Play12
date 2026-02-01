package com.play12.controller;

import com.play12.dto.ProductDTO;
import com.play12.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produtos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {

	private final ProductService productService;

	@GetMapping
	public ResponseEntity<List<ProductDTO>> listar() {
		return ResponseEntity.ok(productService.listar());
	}

	@PostMapping
	public ResponseEntity<ProductDTO> criar(@RequestBody ProductDTO dto) {
		return ResponseEntity.ok(productService.criar(dto));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ProductDTO> atualizar(@PathVariable Long id, @RequestBody ProductDTO dto) {
		return ResponseEntity.ok(productService.atualizar(id, dto));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletar(@PathVariable Long id) {
		productService.deletar(id);
		return ResponseEntity.noContent().build();
	}
}
