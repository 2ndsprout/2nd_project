package com.second_team.apt_project.repositories;

import com.second_team.apt_project.domains.Profile;
import com.second_team.apt_project.repositories.customs.ProfileRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> , ProfileRepositoryCustom {
}
