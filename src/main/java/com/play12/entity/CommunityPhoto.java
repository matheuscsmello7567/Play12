package com.play12.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "community_photos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommunityPhoto {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String titulo;

	@Column(nullable = false)
	private String imagemUrl;

	@Column(nullable = false)
	private LocalDateTime criadoEm = LocalDateTime.now();
}
