package com.second_team.apt_project.services.module;

import com.second_team.apt_project.domains.Article;
import com.second_team.apt_project.domains.Category;
import com.second_team.apt_project.domains.Profile;
import com.second_team.apt_project.repositories.customs.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ArticleService {
    private final ArticleRepository articleRepository;


    public Article save(Category category, Profile profile, String title, String content, Boolean topActive) {
        return articleRepository.save(Article.builder()
                .profile(profile)
                .category(category)
                .content(content)
                .title(title)
                .topActive(topActive)
                .build());
    }
}
