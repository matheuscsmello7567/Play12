package com.play12.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommunityPhotoDTO {
	private Long id;
	private String titulo;
	private String imagemUrl;
	private LocalDateTime criadoEm;
}
