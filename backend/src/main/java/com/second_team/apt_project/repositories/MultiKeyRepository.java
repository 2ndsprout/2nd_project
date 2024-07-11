package com.second_team.apt_project.repositories;

import com.second_team.apt_project.domains.MultiKey;
import com.second_team.apt_project.repositories.customs.MultiKeyRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MultiKeyRepository extends JpaRepository<MultiKey, Long> , MultiKeyRepositoryCustom {
}
