package com.second_team.apt_project.repositories.customs.impls;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.second_team.apt_project.domains.QSiteUser;
import com.second_team.apt_project.domains.SiteUser;
import com.second_team.apt_project.repositories.customs.UserRepositoryCustom;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;

    QSiteUser qSiteUser = QSiteUser.siteUser;

    @Override
    public List<SiteUser> isDuplicateEmail(String email) {
        return jpaQueryFactory.select(qSiteUser).from(qSiteUser).where(qSiteUser.email.eq(email)).fetch();
    }
}
