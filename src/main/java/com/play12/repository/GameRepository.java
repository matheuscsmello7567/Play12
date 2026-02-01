package com.play12.repository;

import com.play12.entity.Game;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface GameRepository extends JpaRepository<Game, Long> {
	List<Game> findByDataGreaterThanEqualOrderByDataAsc(LocalDate data);
	Long countByDataGreaterThanEqual(LocalDate data);
}
