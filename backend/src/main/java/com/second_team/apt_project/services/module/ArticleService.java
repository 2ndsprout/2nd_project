package com.second_team.apt_project.services.module;

import com.second_team.apt_project.domains.Article;
import com.second_team.apt_project.domains.Category;
import com.second_team.apt_project.domains.Profile;
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
}
