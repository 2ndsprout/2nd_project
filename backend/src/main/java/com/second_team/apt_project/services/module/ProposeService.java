package com.second_team.apt_project.services.module;

import com.second_team.apt_project.domains.Propose;
import com.second_team.apt_project.dtos.ProposeRequestDTO;
import com.second_team.apt_project.enums.ProposeStatus;
import com.second_team.apt_project.repositories.ProposeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ProposeService {

    private final ProposeRepository proposeRepository;
    private final PasswordEncoder passwordEncoder;

    public Propose save (ProposeRequestDTO proposeRequestDTO) {
        Propose propose = Propose.builder()
                .title(proposeRequestDTO.getTitle())
                .roadAddress(proposeRequestDTO.getRoadAddress())
                .aptName(proposeRequestDTO.getAptName())
                .password(proposeRequestDTO.getPassword())
                .h(proposeRequestDTO.getH())
                .w(proposeRequestDTO.getW())
                .build();
        return this.proposeRepository.save(propose);
    }

    public Page<Propose> getList (Pageable pageable) {
        return this.proposeRepository.findList(pageable);
    }

    public Propose update (Propose propose, ProposeRequestDTO proposeRequestDTO) {
        propose.setTitle(proposeRequestDTO.getTitle());
        propose.setRoadAddress(proposeRequestDTO.getRoadAddress());
        propose.setAptName(proposeRequestDTO.getAptName());
        propose.setPassword(proposeRequestDTO.getPassword());
        propose.setModifyDate(LocalDateTime.now());
        propose.setProposeStatus(ProposeStatus.values()[proposeRequestDTO.getProposeStatus()]);
        propose.setH(proposeRequestDTO.getH());
        propose.setW(proposeRequestDTO.getW());
        return this.proposeRepository.save(propose);
    }

    public void delete (Propose propose) {
        this.proposeRepository.delete(propose);
    }

    public Propose get (Long id) {
        return this.proposeRepository.findById(id).orElse(null);
    }

    public boolean isMatch(String password1, String password2) {
        return passwordEncoder.matches(password1, password2);
    }
}