package com.second_team.apt_project.repositories.customs.impls;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.second_team.apt_project.domains.Category;
import com.second_team.apt_project.domains.QCategory;
import com.second_team.apt_project.repositories.customs.CategoryRepositoryCustom;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@RequiredArgsConstructor
public class CategoryRepositoryImpl implements CategoryRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;

    QCategory qCategory = QCategory.category;


    @Override
    public List<Category> getList() {
        return jpaQueryFactory.selectFrom(qCategory).fetch();
    }
}
