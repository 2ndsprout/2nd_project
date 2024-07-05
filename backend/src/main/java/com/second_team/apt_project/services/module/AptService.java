package com.second_team.apt_project.services.module;

import com.second_team.apt_project.Exception.DataNotFoundException;
import com.second_team.apt_project.domains.Apt;
import com.second_team.apt_project.repositories.AptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AptService {
    private final AptRepository aptRepository;

    public Apt get(Long aptId) {
        return this.aptRepository.get(aptId).orElseThrow(() -> new DataNotFoundException("not found apt"));
    }
}
