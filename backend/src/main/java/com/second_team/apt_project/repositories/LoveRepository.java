package com.second_team.apt_project.repositories;

import com.second_team.apt_project.domains.Love;
import com.second_team.apt_project.repositories.customs.LoveRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoveRepository extends JpaRepository<Love, Long>, LoveRepositoryCustom {
}
