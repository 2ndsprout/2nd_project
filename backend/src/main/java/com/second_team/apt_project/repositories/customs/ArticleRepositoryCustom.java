package com.second_team.apt_project.repositories.customs;

import com.second_team.apt_project.domains.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ArticleRepositoryCustom {
    Page<Article> findByArticleList(Pageable pageable, Long aptId, Long categoryId);
}
