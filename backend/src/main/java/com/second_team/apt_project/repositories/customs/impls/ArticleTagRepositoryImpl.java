package com.second_team.apt_project.repositories.customs.impls;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.second_team.apt_project.domains.ArticleTag;
import com.second_team.apt_project.domains.QArticleTag;
import com.second_team.apt_project.domains.QTag;
import com.second_team.apt_project.domains.Tag;
import com.second_team.apt_project.repositories.customs.ArticleTagRepositoryCustom;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
public class ArticleTagRepositoryImpl implements ArticleTagRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;

    QArticleTag qArticleTag = QArticleTag.articleTag;
    QTag qTag = QTag.tag;


    @Override
    public List<ArticleTag> findByArticle(Long id) {
        return jpaQueryFactory.selectFrom(qArticleTag).where(qArticleTag.article.id.eq(id)).fetch();
    }

}
