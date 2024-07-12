package com.second_team.apt_project.repositories;

import com.second_team.apt_project.domains.ArticleTag;
import com.second_team.apt_project.repositories.customs.ArticleTagRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleTagRepository extends JpaRepository<ArticleTag, Long>, ArticleTagRepositoryCustom {
}
