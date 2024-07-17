package com.second_team.apt_project.repositories.customs;

import com.second_team.apt_project.domains.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ArticleRepositoryCustom {
    Page<Article> findByArticleList(Pageable pageable, Long aptId, Long categoryId, Boolean topActive);

    List<Article> findByTopActive(Long aptId, Long categoryId, Boolean topActive);
}
