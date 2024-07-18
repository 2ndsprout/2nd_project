package com.second_team.apt_project.repositories.customs.impls;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.second_team.apt_project.domains.*;
import com.second_team.apt_project.repositories.customs.ArticleTagRepositoryCustom;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
public class ArticleTagRepositoryImpl implements ArticleTagRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;

    QArticleTag qArticleTag = QArticleTag.articleTag;
    QArticle qArticle = QArticle.article;


    @Override
    public List<ArticleTag> findByArticle(Long id) {
        return jpaQueryFactory.selectFrom(qArticleTag)
                .leftJoin(qArticleTag.article, qArticle)
                .where(qArticle.id.eq(id)).fetch();
    }

    @Override
    public List<ArticleTag> findByTagList(Long id) {
        return jpaQueryFactory.selectFrom(qArticleTag).where(qArticleTag.tag.id.eq(id)).fetch();
    }

}
