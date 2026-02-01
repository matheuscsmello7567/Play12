package com.play12.service;

import com.play12.dto.ProductDTO;
import com.play12.entity.Product;
import com.play12.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

	private final ProductRepository productRepository;

	public ProductDTO criar(ProductDTO dto) {
		Product product = Product.builder()
				.nome(dto.getNome())
				.categoria(dto.getCategoria())
				.preco(dto.getPreco())
				.descricao(dto.getDescricao())
				.imagemUrl(dto.getImagemUrl())
				.ativo(dto.getAtivo() != null ? dto.getAtivo() : true)
				.build();
		return mapToDTO(productRepository.save(product));
	}

	public List<ProductDTO> listar() {
		return productRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
	}

	public ProductDTO atualizar(Long id, ProductDTO dto) {
		Product product = productRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Produto não encontrado"));
		product.setNome(dto.getNome());
		product.setCategoria(dto.getCategoria());
		product.setPreco(dto.getPreco());
		product.setDescricao(dto.getDescricao());
		product.setImagemUrl(dto.getImagemUrl());
		if (dto.getAtivo() != null) {
			product.setAtivo(dto.getAtivo());
		}
		return mapToDTO(productRepository.save(product));
	}

	public void deletar(Long id) {
		if (!productRepository.existsById(id)) {
			throw new IllegalArgumentException("Produto não encontrado");
		}
		productRepository.deleteById(id);
	}

	private ProductDTO mapToDTO(Product product) {
		return ProductDTO.builder()
				.id(product.getId())
				.nome(product.getNome())
				.categoria(product.getCategoria())
				.preco(product.getPreco())
				.descricao(product.getDescricao())
				.imagemUrl(product.getImagemUrl())
				.ativo(product.getAtivo())
				.build();
	}
}
