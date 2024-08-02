package com.second_team.apt_project.repositories.customs;

import com.second_team.apt_project.domains.Propose;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProposeRepositoryCustom {
    Page<Propose> findList(Pageable pageable, int status);
}
