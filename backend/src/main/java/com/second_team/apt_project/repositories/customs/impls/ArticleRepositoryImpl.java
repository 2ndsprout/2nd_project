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

@RequiredArgsConstructor
public class ArticleRepositoryImpl implements ArticleRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;

    QArticle qArticle = QArticle.article;
    QProfile qProfile = QProfile.profile;
    QSiteUser qSiteUser = QSiteUser.siteUser;
    QApt qApt = QApt.apt;
    QCategory qCategory = QCategory.category;

    @Override
    public Page<Article> findByArticleList(Pageable pageable, Long aptId, Long categoryId) {
        JPAQuery<Article> query = jpaQueryFactory.selectFrom(qArticle)
                .leftJoin(qArticle.profile, qProfile)
                .leftJoin(qProfile.user, qSiteUser)
                .leftJoin(qSiteUser.apt, qApt)
                .where(qApt.id.eq(aptId).and(qCategory.id.eq(categoryId)));

        QueryResults<Article> results = query.fetchResults();
        return new PageImpl<>(results.getResults(), pageable, results.getTotal());
    }
}
