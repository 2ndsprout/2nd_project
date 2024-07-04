package com.second_team.apt_project.repositories;

import com.second_team.apt_project.domains.SiteUser;
import com.second_team.apt_project.repositories.customs.UserRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<SiteUser, String>, UserRepositoryCustom {
    void deleteByUsername(String username);
}