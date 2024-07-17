package com.second_team.apt_project.repositories.customs.impls;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.second_team.apt_project.domains.*;
import com.second_team.apt_project.repositories.customs.ArticleRepositoryCustom;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;

@RequiredArgsConstructor
public class ArticleRepositoryImpl implements ArticleRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;

    QArticle qArticle = QArticle.article;
    QProfile qProfile = QProfile.profile;
    QSiteUser qSiteUser = QSiteUser.siteUser;
    QApt qApt = QApt.apt;
    QCategory qCategory = QCategory.category;

    @Override
    public Page<Article> findByArticleList(Pageable pageable, Long aptId, Long categoryId, Boolean topActive) {
         QueryResults<Article> results= jpaQueryFactory.selectFrom(qArticle)
                .leftJoin(qArticle.profile, qProfile)
                .leftJoin(qProfile.user, qSiteUser)
                .leftJoin(qSiteUser.apt, qApt)
                .where(qArticle.topActive.eq(topActive).and(qApt.id.eq(aptId)).and(qCategory.id.eq(categoryId))).offset(pageable.getOffset()).limit(pageable.getPageSize()).fetchResults();
        return new PageImpl<>(results.getResults(), pageable, results.getTotal());
    }

    @Override
    public List<Article> findByTopActive(Long aptId, Long categoryId, Boolean topActive) {
        return jpaQueryFactory.selectFrom(qArticle)
                .leftJoin(qArticle.profile.user, qSiteUser)
                .leftJoin(qSiteUser.apt, qApt)
                .where(qArticle.topActive.eq(topActive)
                        .and(qApt.id.eq(aptId))
                        .and(qArticle.category.id.eq(categoryId)))
                .fetch();
    }
}
