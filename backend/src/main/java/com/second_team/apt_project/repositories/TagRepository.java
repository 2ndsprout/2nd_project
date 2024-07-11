package com.second_team.apt_project.repositories;

import com.second_team.apt_project.domains.Tag;
import com.second_team.apt_project.repositories.customs.TagRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> , TagRepositoryCustom {
}
