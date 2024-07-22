package com.second_team.apt_project.repositories.customs.impls;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.second_team.apt_project.domains.*;
import com.second_team.apt_project.enums.Sorts;
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
    QArticleTag qArticleTag = QArticleTag.articleTag;

    @Override
    public Page<Article> findByArticleList(Pageable pageable, Long aptId, Long categoryId, Boolean topActive) {
        QueryResults<Article> results = jpaQueryFactory.selectFrom(qArticle)
                .leftJoin(qArticle.profile, qProfile)
                .leftJoin(qProfile.user, qSiteUser)
                .leftJoin(qSiteUser.apt, qApt)
                .where(qArticle.topActive.eq(topActive).and(qApt.id.eq(aptId)).and(qCategory.id.eq(categoryId)))
                .orderBy(qArticle.createDate.desc()).offset(pageable.getOffset()).limit(pageable.getPageSize()).fetchResults();
        return new PageImpl<>(results.getResults(), pageable, results.getTotal());
    }

    @Override
    public List<Article> findByTopActive(Long aptId, Long categoryId, Boolean topActive) {
        return jpaQueryFactory.selectFrom(qArticle).distinct()
                .leftJoin(qArticle.profile.user, qSiteUser)
                .leftJoin(qSiteUser.apt, qApt)
                .where(qArticle.topActive.eq(topActive)
                        .and(qApt.id.eq(aptId))
                        .and(qArticle.category.id.eq(categoryId)))
                .fetch();
    }

    @Override
    public List<Article> findByArticle(Long profileId) {
        return jpaQueryFactory.selectFrom(qArticle).where(qArticle.profile.id.eq(profileId)).fetch();
    }

    @Override
    public Page<Article> searchByKeyword(Long id, Pageable pageable, String keyword, Sorts sorts) {
        JPAQuery<Article> query = jpaQueryFactory
                .selectFrom(qArticle).distinct()
                .leftJoin(qArticleTag).on(qArticleTag.article.id.eq(qArticle.id))
                .where(qProfile.user.apt.id.eq(id))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize());
        switch (sorts) {
            case TITLE:
                query.where(qArticle.title.contains(keyword))
                        .orderBy(qArticle.title.asc(), qArticle.createDate.desc());
                break;
            case TITLE_CONTENT:
                query.where(qArticle.title.contains(keyword).or(qArticle.content.contains(keyword)))
                        .orderBy(qArticle.title.asc(), qArticle.content.asc(), qArticle.createDate.desc());
                break;
            case PROFILE:
                query.where(qArticle.profile.name.contains(keyword))
                        .orderBy(qArticle.profile.name.asc(), qArticle.createDate.desc());
                break;
            case TAG:
                query.leftJoin(qArticleTag)
                        .on(qArticleTag.article.id.eq(qArticle.id))
                        .where(qArticleTag.tag.name.contains(keyword))
                        .groupBy(qArticle.id)
                        .orderBy(qArticleTag.tag.name.asc(), qArticle.createDate.desc());
                break;
            default:
                throw new IllegalArgumentException("Invalid sort option: " + sorts);
        }

        QueryResults<Article> results = query.fetchResults();
        return new PageImpl<>(results.getResults(), pageable, results.getTotal());
    }
}
