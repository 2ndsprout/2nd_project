package com.second_team.apt_project.repositories.customs;

import com.second_team.apt_project.domains.ArticleTag;
import com.second_team.apt_project.domains.Tag;

import java.util.List;
import java.util.Optional;

public interface ArticleTagRepositoryCustom {
    List<ArticleTag> findByArticle(Long id);

}
