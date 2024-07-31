package com.second_team.apt_project.services.module;


import com.second_team.apt_project.domains.Apt;
import com.second_team.apt_project.repositories.AptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AptService {
    private final AptRepository aptRepository;

    public Apt get(Long aptId) {
        return this.aptRepository.get(aptId).orElse(null);
    }
  
    public Apt save(String roadAddress, String aptName) {
    
        return aptRepository.save(Apt.builder()
                .roadAddress(roadAddress)
                .aptName(aptName)
                .build());
    }

    public Apt update(Apt apt, String roadAddress, String aptName) {
        apt.setAptName(aptName);
        apt.setRoadAddress(roadAddress);
        return aptRepository.save(apt);
    }

    public List<Apt> getAptList() {
        return this.aptRepository.findAll();
    }

}
