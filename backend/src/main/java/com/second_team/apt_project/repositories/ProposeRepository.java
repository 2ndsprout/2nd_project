package com.second_team.apt_project.repositories;

import com.second_team.apt_project.domains.Propose;
import com.second_team.apt_project.repositories.customs.ProposeRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProposeRepository extends JpaRepository<Propose, Long>, ProposeRepositoryCustom {

}
