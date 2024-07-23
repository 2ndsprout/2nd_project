package com.second_team.apt_project.services.module;

import com.second_team.apt_project.domains.Article;
import com.second_team.apt_project.domains.ArticleTag;
import com.second_team.apt_project.domains.Tag;
import com.second_team.apt_project.repositories.ArticleTagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ArticleTagService {
    private final ArticleTagRepository articleTagRepository;

    public void save(Article article, Tag tag) {
        articleTagRepository.save(ArticleTag.builder()
                .article(article)
                .tag(tag).build());
    }


    public List<ArticleTag> getArticle(Long articleId) {
        return articleTagRepository.findByArticle(articleId);
    }

    public void delete(ArticleTag articleTag) {
        articleTagRepository.delete(articleTag);
    }

    public List<ArticleTag> findByTagList(Long id) {
        return articleTagRepository.findByTagList(id);
    }

    public ArticleTag findById(Long id) {
        return articleTagRepository.findById(id).orElse(null);
    }

    public ArticleTag findByTagId(Long id) {
        return articleTagRepository.findByTagId(id);
    }
}
