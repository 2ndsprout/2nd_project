package com.second_team.apt_project.repositories.customs.impls;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.second_team.apt_project.domains.MultiKey;
import com.second_team.apt_project.domains.QMultiKey;
import com.second_team.apt_project.repositories.customs.MultiKeyRepositoryCustom;
import lombok.RequiredArgsConstructor;

import java.util.Optional;

@RequiredArgsConstructor
public class MultiKeyRepositoryImpl implements MultiKeyRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;

    QMultiKey qMultiKey = QMultiKey.multiKey;
    @Override
    public Optional<MultiKey> findByKey(String k) {
        return Optional.ofNullable(jpaQueryFactory.selectFrom(qMultiKey).where(qMultiKey.k.eq(k)).fetchOne());
    }
}
