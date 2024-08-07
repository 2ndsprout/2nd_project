package com.second_team.apt_project.securities;

import com.second_team.apt_project.domains.Apt;
import com.second_team.apt_project.domains.SiteUser;
import com.second_team.apt_project.enums.UserRole;
import com.second_team.apt_project.repositories.AptRepository;
import com.second_team.apt_project.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AptRepository aptRepository;

    @Override
    public void run(String... args) throws Exception {

        Optional<Apt> _apt = this.aptRepository.findById(1L);
        Apt apt;
        if (_apt.isPresent()) {
            apt = _apt.get();
        } else {
            apt = Apt.builder()
                    .aptName("admin")
                    .roadAddress("admin")
                    .build();
            this.aptRepository.save(apt);
            System.out.println("Admin Apt created");
        }

        SiteUser _admin = userRepository.findByUsername("admin");
        if (_admin == null) {
            SiteUser admin = SiteUser.builder()
                    .username("admin")
                    .apt(apt)
                    .email("admin@honeydanji.co.kr")
                    .role(UserRole.ADMIN)
                    .password(passwordEncoder.encode("123"))
                    .aptNum(1)
                    .build();
            this.userRepository.save(admin);
            System.out.println("Admin account created");
        } else {
            System.out.println("Admin account already exists");
        }
    }
}
