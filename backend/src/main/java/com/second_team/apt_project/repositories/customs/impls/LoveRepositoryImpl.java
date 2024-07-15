package com.second_team.apt_project.repositories.customs.impls;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.second_team.apt_project.domains.Article;
import com.second_team.apt_project.domains.Love;
import com.second_team.apt_project.domains.Profile;
import com.second_team.apt_project.domains.QLove;
import com.second_team.apt_project.repositories.customs.LoveRepositoryCustom;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
public class LoveRepositoryImpl implements LoveRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;
    QLove qLove = QLove.love;

    @Override
    public Optional<Love> findByArticleAndProfile(Article article, Profile profile) {
        return Optional.ofNullable(jpaQueryFactory.selectFrom(qLove).where(qLove.article.eq(article).and(qLove.profile.eq(profile))).fetchOne());
    }

    @Override
    public List<Love> findByArticle(Long id) {
        return jpaQueryFactory.selectFrom(qLove).where(qLove.article.id.eq(id)).fetch();
    }
}
