package com.second_team.apt_project.repositories;

import com.second_team.apt_project.domains.Article;
import com.second_team.apt_project.domains.ArticleTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleTagRepository extends JpaRepository<ArticleTag, Long> {
}
