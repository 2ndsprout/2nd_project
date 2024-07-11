package com.second_team.apt_project.repositories.customs;

import com.second_team.apt_project.domains.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
}
