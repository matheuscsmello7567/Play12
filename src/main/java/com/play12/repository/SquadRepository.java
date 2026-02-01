package com.play12.repository;

import com.play12.entity.Squad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SquadRepository extends JpaRepository<Squad, Long> {
	Optional<Squad> findByNome(String nome);
	boolean existsByNome(String nome);
}
