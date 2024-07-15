package com.second_team.apt_project.repositories;

import com.second_team.apt_project.domains.CultureCenter;
import com.second_team.apt_project.repositories.customs.CultureCenterRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CultureCenterRepository extends JpaRepository<CultureCenter, Long> , CultureCenterRepositoryCustom {
}
