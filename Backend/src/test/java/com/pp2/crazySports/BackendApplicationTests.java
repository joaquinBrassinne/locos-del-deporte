package com.pp2.crazySports;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class BackendApplicationTests {

	@Test
	@DisplayName("TC-CTX-01 Debe cargar el contexto de Spring Boot exitosamente")
	void contextLoads() {
	}

}
