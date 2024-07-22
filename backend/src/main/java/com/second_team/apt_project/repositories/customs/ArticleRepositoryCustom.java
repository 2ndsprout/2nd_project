package com.second_team.apt_project.repositories.customs;

import com.second_team.apt_project.domains.Article;
import com.second_team.apt_project.enums.Sorts;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;

public interface ArticleRepositoryCustom {
    Page<Article> findByArticleList(Pageable pageable, Long aptId, Long categoryId, Boolean topActive);

    List<Article> findByTopActive(Long aptId, Long categoryId, Boolean topActive);

    List<Article> findByArticle(Long profileId);

    Page<Article> searchByKeyword(Long id,Pageable pageable, String keyword, Sorts sorts);

    Page<Article> searchByCategoryKeyword(Long id, Pageable pageable, String keyword, Sorts sorts, Long categoryId);
}
