package com.second_team.apt_project.repositories.customs;

import com.second_team.apt_project.domains.Apt;

import java.util.Optional;

public interface AptRepositoryCustom {
    Optional<Apt> get(Long aptId);

}
