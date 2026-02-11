package com.play12.repository;

import com.play12.entity.GameOperador;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GameOperadorRepository extends JpaRepository<GameOperador, Long> {
	List<GameOperador> findByGameId(Long gameId);

	Optional<GameOperador> findByGameIdAndOperadorId(Long gameId, Long operadorId);

	boolean existsByGameIdAndOperadorId(Long gameId, Long operadorId);

	void deleteByGameIdAndOperadorId(Long gameId, Long operadorId);

	long countByGameId(Long gameId);
}
