package com.second_team.apt_project.repositories.customs.impls;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.second_team.apt_project.domains.QApt;
import com.second_team.apt_project.repositories.customs.AptRepositoryCustom;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class AptRepositoryImpl implements AptRepositoryCustom {
    private JPAQueryFactory jpaQueryFactory;
    QApt qApt = QApt.apt;
}
