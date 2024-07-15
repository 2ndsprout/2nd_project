package com.second_team.apt_project.repositories.customs.impls;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.second_team.apt_project.domains.CultureCenter;
import com.second_team.apt_project.domains.QCultureCenter;
import com.second_team.apt_project.repositories.customs.CultureCenterRepositoryCustom;
import lombok.RequiredArgsConstructor;

import java.util.List;


@RequiredArgsConstructor
public class CultureCenterRepositoryImpl implements CultureCenterRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;
    QCultureCenter qCultureCenter = QCultureCenter.cultureCenter;


    @Override
    public List<CultureCenter> getList() {
        return jpaQueryFactory.selectFrom(qCultureCenter).orderBy(qCultureCenter.createDate.asc()).fetch();
    }
}
