package com.second_team.apt_project.repositories.customs.impls;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.second_team.apt_project.domains.Apt;
import com.second_team.apt_project.domains.QApt;
import com.second_team.apt_project.repositories.customs.AptRepositoryCustom;
import lombok.RequiredArgsConstructor;

import java.util.Optional;

@RequiredArgsConstructor
public class AptRepositoryImpl implements AptRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;

    QApt qApt = QApt.apt;

    @Override
    public Optional<Apt> get(Long aptId) {
        return Optional.ofNullable(jpaQueryFactory.selectFrom(qApt).where(qApt.id.eq(aptId)).fetchOne());
    }
}
