package com.pp2.crazySports;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		// Forzamos la zona horaria antes de que arranque Spring
		TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
		SpringApplication.run(BackendApplication.class, args);
	}

	@PostConstruct
	public void init() {
		// Doble validación para asegurar que los logs y la DB coincidan
		TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
	}
}
