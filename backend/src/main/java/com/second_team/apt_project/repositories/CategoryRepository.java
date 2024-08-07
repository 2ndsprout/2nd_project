package com.second_team.apt_project.repositories;

import com.second_team.apt_project.domains.Category;
import com.second_team.apt_project.repositories.customs.CategoryRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long>, CategoryRepositoryCustom {
    Optional<Category> findByName(String categoryName);
}
