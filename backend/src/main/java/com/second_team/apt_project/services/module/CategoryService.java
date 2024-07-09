package com.second_team.apt_project.services.module;

import com.second_team.apt_project.domains.Category;
import com.second_team.apt_project.repositories.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public Category save(String name) {
        return categoryRepository.save(Category.builder()
                .name(name).build());
    }
}
