package com.second_team.apt_project.repositories.customs.impls;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.second_team.apt_project.domains.QSiteUser;
import com.second_team.apt_project.domains.SiteUser;
import com.second_team.apt_project.dtos.UserResponseDTO;
import com.second_team.apt_project.enums.UserRole;
import com.second_team.apt_project.repositories.customs.UserRepositoryCustom;
import lombok.RequiredArgsConstructor;

import java.util.Collections;
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
    public List<SiteUser> findByUserList(Long aptId, UserRole userRole) {
        List<SiteUser> siteUser = jpaQueryFactory.selectFrom(qSiteUser)
                .where(qSiteUser.role.eq(userRole).and(qSiteUser.apt.id.eq(aptId))).fetch();
        return siteUser;
    }

    @Override
    public SiteUser findByUser(String userId) {
        return jpaQueryFactory.selectFrom(qSiteUser).where(qSiteUser.username.eq(userId)).fetchOne();
    }
}
