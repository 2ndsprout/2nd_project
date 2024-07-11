package com.second_team.apt_project.repositories.customs;

import com.second_team.apt_project.domains.MultiKey;

import java.util.Optional;

public interface MultiKeyRepositoryCustom {
    Optional<MultiKey> findByKey(String k);
}
