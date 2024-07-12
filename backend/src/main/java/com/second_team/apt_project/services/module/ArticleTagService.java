package com.second_team.apt_project.services.module;

import com.second_team.apt_project.domains.Article;
import com.second_team.apt_project.domains.ArticleTag;
import com.second_team.apt_project.domains.Tag;
import com.second_team.apt_project.repositories.ArticleTagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ArticleTagService {
    private final ArticleTagRepository articleTagRepository;

    public void save(Article article, Tag tag) {
        articleTagRepository.save(ArticleTag.builder()
                .article(article)
                .tag(tag).build());
    }
}
