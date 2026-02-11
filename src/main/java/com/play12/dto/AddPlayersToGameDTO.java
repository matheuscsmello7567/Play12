package com.play12.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddPlayersToGameDTO {
	private List<PlayerEntry> players;

	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	public static class PlayerEntry {
		private Long operadorId;
		private String team;
		private String squad;
	}
}
