package com.second_team.apt_project.services.module;

import com.second_team.apt_project.domains.*;
import com.second_team.apt_project.dtos.ArticleResponseDTO;
import com.second_team.apt_project.repositories.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ArticleService {
    private final ArticleRepository articleRepository;

    public Article save(Profile profile, String title, String content, Category category) {
        return articleRepository.save(Article.builder()
                .profile(profile)
                .category(category)
                .title(title)
                .content(content)
                .build());
    }

    public void updateContent(Article article, String content) {
        article.setContent(content);
        this.articleRepository.save(article);
    }

    public Article findById(Long articleId) {
        return articleRepository.findById(articleId).orElse(null);
    }
}
