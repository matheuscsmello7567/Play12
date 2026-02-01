package com.play12.security;

import com.play12.entity.Operador;
import com.play12.repository.OperadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OperadorDetailsService implements UserDetailsService {

	private final OperadorRepository operadorRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Operador operador = operadorRepository.findByEmail(username)
				.orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
		return new OperadorUserDetails(operador);
	}
}
