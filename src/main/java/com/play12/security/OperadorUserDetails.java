package com.play12.security;

import com.play12.entity.Operador;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class OperadorUserDetails implements UserDetails {

	private final Operador operador;

	public OperadorUserDetails(Operador operador) {
		this.operador = operador;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(new SimpleGrantedAuthority("ROLE_" + operador.getTipo().name()));
	}

	@Override
	public String getPassword() {
		return operador.getSenha();
	}

	@Override
	public String getUsername() {
		return operador.getEmail();
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

	public Operador getOperador() {
		return operador;
	}
}
