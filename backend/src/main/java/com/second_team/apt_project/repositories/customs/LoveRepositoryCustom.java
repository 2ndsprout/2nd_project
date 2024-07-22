package com.second_team.apt_project.repositories.customs;

import com.second_team.apt_project.domains.Article;
import com.second_team.apt_project.domains.Love;
import com.second_team.apt_project.domains.Profile;

import java.util.List;
import java.util.Optional;

public interface LoveRepositoryCustom {
    Optional<Love> findByArticleAndProfile(Article article, Profile profile);

    List<Love> findByArticle(Long id);

    boolean existsByArticleAndProfile(Article article, Profile profile);

    int countByArticleId(Long articleId);
}
