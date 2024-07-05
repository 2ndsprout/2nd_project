package com.second_team.apt_project;

import com.second_team.apt_project.domains.SiteUser;
import com.second_team.apt_project.enums.UserRole;
import com.second_team.apt_project.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

@SpringBootTest
class AptProjectApplicationTests {
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private PasswordEncoder passwordEncoder;

	@Test
	void createAdmin(){
		userRepository.save(SiteUser.builder().username("admin").password(passwordEncoder.encode("123")).role(UserRole.ADMIN).email("admin@naver.com").build());
	}

}
