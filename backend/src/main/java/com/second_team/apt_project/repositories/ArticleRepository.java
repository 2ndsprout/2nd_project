package com.second_team.apt_project.repositories;

import com.second_team.apt_project.domains.Article;
import com.second_team.apt_project.repositories.customs.ArticleRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long>, ArticleRepositoryCustom {
}
