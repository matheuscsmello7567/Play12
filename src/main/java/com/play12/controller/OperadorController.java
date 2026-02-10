package com.play12.controller;

import com.play12.dto.CadastroDTO;
import com.play12.dto.LoginDTO;
import com.play12.dto.OperadorAdminUpdateDTO;
import com.play12.dto.OperadorDTO;
import com.play12.dto.OperadorUpdatePontosDTO;
import com.play12.service.OperadorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/operadores")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OperadorController {

	private final OperadorService operadorService;

	@PostMapping("/cadastro")
	public ResponseEntity<Map<String, Object>> cadastro(@Valid @RequestBody CadastroDTO dto) {
		Map<String, Object> response = new HashMap<>();
		try {
			OperadorDTO operador = operadorService.cadastrar(dto);
			response.put("success", true);
			response.put("message", "Cadastro realizado com sucesso!");
			response.put("data", operador);
			return ResponseEntity.status(HttpStatus.CREATED).body(response);
		} catch (IllegalArgumentException e) {
			response.put("success", false);
			response.put("message", e.getMessage());
			return ResponseEntity.badRequest().body(response);
		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "Erro ao cadastrar: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

	@PostMapping("/login")
	public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginDTO dto) {
		Map<String, Object> response = new HashMap<>();
		try {
			OperadorDTO operador = operadorService.login(dto);
			response.put("success", true);
			response.put("message", "Login realizado com sucesso!");
			response.put("data", operador);
			return ResponseEntity.ok(response);
		} catch (IllegalArgumentException e) {
			response.put("success", false);
			response.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "Erro ao fazer login: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

	@GetMapping("/{id}")
	public ResponseEntity<Map<String, Object>> obterPorId(@PathVariable Long id) {
		Map<String, Object> response = new HashMap<>();
		try {
			OperadorDTO operador = operadorService.buscarPorId(id);
			response.put("success", true);
			response.put("data", operador);
			return ResponseEntity.ok(response);
		} catch (IllegalArgumentException e) {
			response.put("success", false);
			response.put("message", e.getMessage());
			return ResponseEntity.badRequest().body(response);
		}
	}

	@GetMapping
	public ResponseEntity<Map<String, Object>> listar() {
		Map<String, Object> response = new HashMap<>();
		try {
			List<OperadorDTO> operadores = operadorService.listarTodos();
			response.put("success", true);
			response.put("data", operadores);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "Erro ao listar operadores: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

	@PutMapping("/{id}")
	public ResponseEntity<Map<String, Object>> atualizar(@PathVariable Long id, @Valid @RequestBody CadastroDTO dto) {
		Map<String, Object> response = new HashMap<>();
		try {
			OperadorDTO operador = operadorService.atualizar(id, dto);
			response.put("success", true);
			response.put("message", "Operador atualizado com sucesso!");
			response.put("data", operador);
			return ResponseEntity.ok(response);
		} catch (IllegalArgumentException e) {
			response.put("success", false);
			response.put("message", e.getMessage());
			return ResponseEntity.badRequest().body(response);
		}
	}

	@PutMapping("/{id}/admin")
	public ResponseEntity<Map<String, Object>> atualizarAdmin(@PathVariable Long id, @RequestBody OperadorAdminUpdateDTO dto) {
		Map<String, Object> response = new HashMap<>();
		try {
			OperadorDTO operador = operadorService.atualizarAdmin(id, dto);
			response.put("success", true);
			response.put("message", "Operador atualizado com sucesso!");
			response.put("data", operador);
			return ResponseEntity.ok(response);
		} catch (IllegalArgumentException e) {
			response.put("success", false);
			response.put("message", e.getMessage());
			return ResponseEntity.badRequest().body(response);
		}
	}

	@PutMapping("/{id}/pontos")
	public ResponseEntity<Map<String, Object>> atualizarPontos(@PathVariable Long id, @RequestBody OperadorUpdatePontosDTO dto) {
		Map<String, Object> response = new HashMap<>();
		try {
			OperadorDTO operador = operadorService.atualizarPontos(id, dto.getPontos());
			response.put("success", true);
			response.put("message", "Pontos atualizados com sucesso!");
			response.put("data", operador);
			return ResponseEntity.ok(response);
		} catch (IllegalArgumentException e) {
			response.put("success", false);
			response.put("message", e.getMessage());
			return ResponseEntity.badRequest().body(response);
		}
	}

	@PutMapping("/{operadorId}/squad/{squadId}")
	public ResponseEntity<Map<String, Object>> adicionarAoSquad(@PathVariable Long operadorId, @PathVariable Long squadId) {
		Map<String, Object> response = new HashMap<>();
		try {
			OperadorDTO operador = operadorService.adicionarAoSquad(operadorId, squadId);
			response.put("success", true);
			response.put("message", "Operador adicionado ao squad com sucesso!");
			response.put("data", operador);
			return ResponseEntity.ok(response);
		} catch (IllegalArgumentException e) {
			response.put("success", false);
			response.put("message", e.getMessage());
			return ResponseEntity.badRequest().body(response);
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Map<String, Object>> deletar(@PathVariable Long id) {
		Map<String, Object> response = new HashMap<>();
		try {
			operadorService.deletar(id);
			response.put("success", true);
			response.put("message", "Operador deletado com sucesso!");
			return ResponseEntity.ok(response);
		} catch (IllegalArgumentException e) {
			response.put("success", false);
			response.put("message", e.getMessage());
			return ResponseEntity.badRequest().body(response);
		}
	}

}
