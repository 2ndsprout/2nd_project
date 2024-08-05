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

    public Propose save (String title, String email, String roadAddress, String aptName, Integer max, Integer min, String password, Integer h, Integer w) {
        Propose propose = Propose.builder()
                .title(title)//
                .roadAddress(roadAddress)//
                .aptName(aptName)//
                .email(email)//
                .min(min)//
                .max(max)//
                .password(passwordEncoder.encode(password))//
                .h(h)//
                .w(w)//
                .build();
        return this.proposeRepository.save(propose);
    }

    public Page<Propose> getList (Pageable pageable, int status) {
        return this.proposeRepository.findList(pageable, status);
    }

    public Propose update (Propose propose, ProposeRequestDTO proposeRequestDTO) {
        propose.setTitle(proposeRequestDTO.getTitle());
        propose.setRoadAddress(proposeRequestDTO.getRoadAddress());
        propose.setAptName(proposeRequestDTO.getAptName());
        propose.setMin(proposeRequestDTO.getMin());
        propose.setMax(proposeRequestDTO.getMax());
        propose.setModifyDate(LocalDateTime.now());
        propose.setProposeStatus(ProposeStatus.values()[proposeRequestDTO.getProposeStatus()]);
        propose.setEmail(proposeRequestDTO.getEmail());
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

    public boolean isMatchPropose(String password1, String password2) {
        return passwordEncoder.matches(password1, password2);
    }
}
