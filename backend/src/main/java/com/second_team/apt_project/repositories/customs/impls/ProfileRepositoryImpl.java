package com.second_team.apt_project.repositories.customs.impls;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.second_team.apt_project.domains.Profile;
import com.second_team.apt_project.domains.QProfile;
import com.second_team.apt_project.domains.SiteUser;
import com.second_team.apt_project.repositories.customs.ProfileRepositoryCustom;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class ProfileRepositoryImpl implements ProfileRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;

    QProfile qProfile = QProfile.profile;
    @Override
    public List<Profile> findProfilesByUserList(SiteUser user) {
        return jpaQueryFactory.selectFrom(qProfile).where(qProfile.user.eq(user)).fetch();
    }
}
