package com.second_team.apt_project.repositories.customs.impls;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.second_team.apt_project.domains.QSiteUser;
import com.second_team.apt_project.domains.SiteUser;
import com.second_team.apt_project.repositories.customs.UserRepositoryCustom;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;

@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;

    QSiteUser qSiteUser = QSiteUser.siteUser;

    @Override
    public List<SiteUser> isDuplicateEmail(String email) {
        return jpaQueryFactory.select(qSiteUser).from(qSiteUser).where(qSiteUser.email.eq(email)).fetch();
    }

    @Override
    public Page<SiteUser> findByUserList(Pageable pageable, Long aptId) {
        JPAQuery<SiteUser> query = jpaQueryFactory.selectFrom(qSiteUser)
                .where(qSiteUser.apt.id.eq(aptId))
                .orderBy(qSiteUser.role.asc())
                .orderBy(qSiteUser.username.asc()).offset(pageable.getOffset()).limit(pageable.getPageSize());

        QueryResults<SiteUser> results = query.fetchResults();
        return new PageImpl<>(results.getResults(), pageable, results.getTotal());
    }

    @Override
    public SiteUser findByUsername(String username) {
        return jpaQueryFactory.selectFrom(qSiteUser).where(qSiteUser.username.eq(username)).fetchOne();
    }
}
