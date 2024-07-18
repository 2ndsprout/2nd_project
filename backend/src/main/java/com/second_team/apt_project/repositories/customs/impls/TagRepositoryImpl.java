package com.second_team.apt_project.repositories.customs.impls;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.second_team.apt_project.domains.QTag;
import com.second_team.apt_project.domains.Tag;
import com.second_team.apt_project.repositories.customs.TagRepositoryCustom;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
public class TagRepositoryImpl  implements TagRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;
    QTag qTag = QTag.tag;


    @Override
    public Optional<Tag> findByName(String name) {
        return Optional.ofNullable(jpaQueryFactory.selectFrom(qTag).where(qTag.name.eq(name)).fetchOne());
    }

    @Override
    public List<Tag> findByIdList(Long tagId) {
        return jpaQueryFactory.selectFrom(qTag).where(qTag.id.eq(tagId)).fetch();
    }
}
