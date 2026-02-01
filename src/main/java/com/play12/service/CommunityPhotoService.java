package com.play12.service;

import com.play12.dto.CommunityPhotoDTO;
import com.play12.entity.CommunityPhoto;
import com.play12.repository.CommunityPhotoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CommunityPhotoService {

	private final CommunityPhotoRepository communityPhotoRepository;

	public CommunityPhotoDTO criar(CommunityPhotoDTO dto) {
		CommunityPhoto photo = CommunityPhoto.builder()
				.titulo(dto.getTitulo())
				.imagemUrl(dto.getImagemUrl())
				.build();
		return mapToDTO(communityPhotoRepository.save(photo));
	}

	public List<CommunityPhotoDTO> listar() {
		return communityPhotoRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
	}

	public void deletar(Long id) {
		if (!communityPhotoRepository.existsById(id)) {
			throw new IllegalArgumentException("Foto não encontrada");
		}
		communityPhotoRepository.deleteById(id);
	}

	private CommunityPhotoDTO mapToDTO(CommunityPhoto photo) {
		return CommunityPhotoDTO.builder()
				.id(photo.getId())
				.titulo(photo.getTitulo())
				.imagemUrl(photo.getImagemUrl())
				.criadoEm(photo.getCriadoEm())
				.build();
	}
}
